import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/cn";

/**
 * Bölüm arkasındaki soft görsel katmanı.
 *
 * Görsel düşük opaklıkta ve istenirse bulanık durur, gradyanlarla sayfa
 * zeminine eriyerek biter; metin kontrastı korunur, sert kenar oluşmaz.
 *
 * `fade="down"`  → sayfa başlıkları için: üstte hafif, altta tam örtü (başlık kabuğu beyaz).
 * `fade="both"`  → sayfa ortasındaki bölümler için: iki uçta da erir.
 */
export function HeroBackdrop({
  photo,
  className,
  opacity = "opacity-[0.14]",
  blur,
  fade = "down",
}: {
  photo: { src: string };
  className?: string;
  opacity?: string;
  blur?: string;
  fade?: "down" | "both";
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <Img
        src={photo.src}
        alt=""
        fill
        priority={fade === "down"}
        sizes="100vw"
        className={cn("scale-110 object-cover object-center", opacity, blur)}
      />

      {fade === "down" ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/85 to-white" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
        </>
      ) : (
        <>
          {/* Ortada görsel okunsun, iki uçta zemine tam erisin. */}
          <div className="from-cream via-cream/35 to-cream absolute inset-0 bg-gradient-to-b" />
          <div className="from-cream/55 to-cream/55 absolute inset-0 bg-gradient-to-r via-transparent" />
        </>
      )}
    </div>
  );
}
