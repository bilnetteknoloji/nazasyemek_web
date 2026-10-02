// Videoyu belirli boyut ve bitrate ile H.264 + AAC MP4'e çevirir (ffmpeg yok; avconvert
// hazır ayarlarında bitrate seçilemiyor). prepare-assets.mjs çağırır:
//   swift scripts/compress-video.swift <kaynak> <hedef.mp4> <uzun kenar px> <video kbps>
import AVFoundation

let args = CommandLine.arguments
guard args.count == 5, let longEdge = Double(args[3]), let kbps = Int(args[4]) else {
  FileHandle.standardError.write("kullanım: compress-video.swift <kaynak> <hedef> <uzun kenar> <kbps>\n".data(using: .utf8)!)
  exit(2)
}
let source = URL(fileURLWithPath: args[1])
let target = URL(fileURLWithPath: args[2])
try? FileManager.default.removeItem(at: target)

let asset = AVURLAsset(url: source)
let semaphore = DispatchSemaphore(value: 0)

Task {
  do {
    guard let videoTrack = try await asset.loadTracks(withMediaType: .video).first else {
      throw NSError(domain: "compress", code: 1, userInfo: [NSLocalizedDescriptionKey: "video izi yok"])
    }
    let audioTrack = try await asset.loadTracks(withMediaType: .audio).first
    let (natural, transform) = try await videoTrack.load(.naturalSize, .preferredTransform)
    let oriented = natural.applying(transform)
    let (w0, h0) = (abs(oriented.width), abs(oriented.height))
    let scale = min(1, longEdge / max(w0, h0))
    // H.264 için çift sayılı boyut.
    let width = Int((w0 * scale / 2).rounded()) * 2
    let height = Int((h0 * scale / 2).rounded()) * 2

    let reader = try AVAssetReader(asset: asset)
    let writer = try AVAssetWriter(outputURL: target, fileType: .mp4)
    writer.shouldOptimizeForNetworkUse = true  // moov başta: indirme bitmeden oynar

    // Döndürme kaynağın transform'u ile composition üzerinden uygulanır.
    let composition = AVMutableVideoComposition()
    composition.renderSize = CGSize(width: width, height: height)
    composition.frameDuration = CMTime(value: 1, timescale: 30)
    let instruction = AVMutableVideoCompositionInstruction()
    instruction.timeRange = CMTimeRange(start: .zero, duration: try await asset.load(.duration))
    let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: videoTrack)
    layer.setTransform(transform.concatenating(CGAffineTransform(scaleX: scale, y: scale)), at: .zero)
    instruction.layerInstructions = [layer]
    composition.instructions = [instruction]

    let videoOut = AVAssetReaderVideoCompositionOutput(
      videoTracks: [videoTrack],
      videoSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange])
    videoOut.videoComposition = composition
    reader.add(videoOut)

    let videoIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
      AVVideoCodecKey: AVVideoCodecType.h264,
      AVVideoWidthKey: width,
      AVVideoHeightKey: height,
      AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: kbps * 1000,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoMaxKeyFrameIntervalKey: 60,
      ],
    ])
    videoIn.expectsMediaDataInRealTime = false
    writer.add(videoIn)

    var pairs: [(AVAssetReaderOutput, AVAssetWriterInput)] = [(videoOut, videoIn)]
    if let audioTrack {
      let audioOut = AVAssetReaderTrackOutput(track: audioTrack, outputSettings: [AVFormatIDKey: kAudioFormatLinearPCM])
      reader.add(audioOut)
      let audioIn = AVAssetWriterInput(mediaType: .audio, outputSettings: [
        AVFormatIDKey: kAudioFormatMPEG4AAC,
        AVNumberOfChannelsKey: 2,
        AVSampleRateKey: 44100,
        AVEncoderBitRateKey: 96_000,
      ])
      writer.add(audioIn)
      pairs.append((audioOut, audioIn))
    }

    reader.startReading()
    writer.startWriting()
    writer.startSession(atSourceTime: .zero)

    let group = DispatchGroup()
    for (output, input) in pairs {
      group.enter()
      let queue = DispatchQueue(label: "compress.\(input.mediaType.rawValue)")
      input.requestMediaDataWhenReady(on: queue) {
        while input.isReadyForMoreMediaData {
          if let sample = output.copyNextSampleBuffer() {
            input.append(sample)
          } else {
            input.markAsFinished()
            group.leave()
            return
          }
        }
      }
    }
    group.wait()
    await writer.finishWriting()
    if writer.status != .completed { throw writer.error ?? NSError(domain: "compress", code: 2) }
    print("\(width)x\(height) @ \(kbps) kbps")
  } catch {
    FileHandle.standardError.write("hata: \(error.localizedDescription)\n".data(using: .utf8)!)
    exit(1)
  }
  semaphore.signal()
}
semaphore.wait()
