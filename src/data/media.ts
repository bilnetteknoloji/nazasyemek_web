// Bu dosya scripts/prepare-assets.mjs tarafından üretilir. Elle düzenlemeyin.

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  tag: "servis" | "mutfak" | "kumanya" | "organizasyon";
};

export type GalleryGroup = "tesis" | "mutfak" | "kumanya" | "servis" | "organizasyon" | "video";

/** Galeri öğesi. Fotoğraflarda `src`/`thumb` filigranlıdır; videoda `thumb` poster. */
export type GalleryItem = {
  type: "photo" | "video";
  group: GalleryGroup;
  alt: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
};

export type Certificate = {
  id: string;
  title: string;
  subtitle: string;
  pdf: string;
  thumb: { src: string; width: number; height: number } | null;
};

export const photos: Photo[] = [
  {
    "src": "/gorseller/nazas1.webp",
    "width": 1147,
    "height": 628,
    "alt": "Açık büfe servisinde tabaklar hazırlanıyor",
    "tag": "organizasyon"
  },
  {
    "src": "/gorseller/nazas2.webp",
    "width": 602,
    "height": 421,
    "alt": "Sıcak yemek servisi",
    "tag": "servis"
  },
  {
    "src": "/gorseller/nazas3.webp",
    "width": 1350,
    "height": 1800,
    "alt": "Endüstriyel mutfakta hazırlık",
    "tag": "mutfak"
  },
  {
    "src": "/gorseller/nazas4.webp",
    "width": 1200,
    "height": 1600,
    "alt": "Günlük menü sunumu",
    "tag": "servis"
  },
  {
    "src": "/gorseller/nazas5.webp",
    "width": 960,
    "height": 1206,
    "alt": "Bölmeli kaplarda hazırlanmış kumanya öğünleri",
    "tag": "kumanya"
  },
  {
    "src": "/gorseller/nazas6.webp",
    "width": 1200,
    "height": 1600,
    "alt": "Paket öğün hazırlığı",
    "tag": "kumanya"
  },
  {
    "src": "/gorseller/nazas7.webp",
    "width": 1200,
    "height": 1600,
    "alt": "Yemekhane servisi",
    "tag": "servis"
  },
  {
    "src": "/gorseller/nazas8.webp",
    "width": 1200,
    "height": 1600,
    "alt": "Ana yemek sunumu",
    "tag": "servis"
  },
  {
    "src": "/gorseller/nazas9.webp",
    "width": 768,
    "height": 1024,
    "alt": "Mutfak ekibi çalışırken",
    "tag": "mutfak"
  },
  {
    "src": "/gorseller/nazas10.webp",
    "width": 768,
    "height": 1024,
    "alt": "Toplu yemek üretimi",
    "tag": "mutfak"
  },
  {
    "src": "/gorseller/nazas11.webp",
    "width": 1200,
    "height": 1600,
    "alt": "Menü çeşitleri",
    "tag": "servis"
  },
  {
    "src": "/gorseller/nazas12.webp",
    "width": 1200,
    "height": 1600,
    "alt": "Porsiyonlama hattı",
    "tag": "mutfak"
  },
  {
    "src": "/gorseller/nazas13.webp",
    "width": 1200,
    "height": 1600,
    "alt": "Organizasyon masası düzeni",
    "tag": "organizasyon"
  },
  {
    "src": "/gorseller/nazas14.webp",
    "width": 1200,
    "height": 1600,
    "alt": "Tabldot servis hattı",
    "tag": "servis"
  },
  {
    "src": "/gorseller/nazas15.webp",
    "width": 1200,
    "height": 1600,
    "alt": "Sıcak yemek kapları",
    "tag": "kumanya"
  },
  {
    "src": "/gorseller/nazas16.webp",
    "width": 1200,
    "height": 1600,
    "alt": "Salata ve mezeler",
    "tag": "servis"
  },
  {
    "src": "/gorseller/nazas17.webp",
    "width": 1200,
    "height": 1600,
    "alt": "Günün yemekleri",
    "tag": "servis"
  },
  {
    "src": "/gorseller/nazas18.webp",
    "width": 1200,
    "height": 1600,
    "alt": "Paketlenmiş öğünler",
    "tag": "kumanya"
  },
  {
    "src": "/gorseller/nazas19.webp",
    "width": 1200,
    "height": 1600,
    "alt": "Tatlı sunumu",
    "tag": "servis"
  },
  {
    "src": "/gorseller/nazas20.webp",
    "width": 1531,
    "height": 1600,
    "alt": "Davet ve organizasyon servisi",
    "tag": "organizasyon"
  }
];

export const videos: { src: string }[] = [
  {
    "src": "/video/nazasvideo1.mp4"
  },
  {
    "src": "/video/nazasvideo2.mp4"
  },
  {
    "src": "/video/nazasvideo3.mp4"
  }
];

export const certificates: Certificate[] = [
  {
    "id": "IMG_20260909_0003",
    "pdf": "/belgeler/IMG_20260909_0003.pdf",
    "thumb": {
      "src": "/belgeler/IMG_20260909_0003.webp",
      "width": 900,
      "height": 1274
    },
    "title": "ISO 9001:2015",
    "subtitle": "Kalite Yönetim Sistemi"
  },
  {
    "id": "IMG_20260909_0010",
    "pdf": "/belgeler/IMG_20260909_0010.pdf",
    "thumb": {
      "src": "/belgeler/IMG_20260909_0010.webp",
      "width": 900,
      "height": 1274
    },
    "title": "ISO 22000:2018",
    "subtitle": "Gıda Güvenliği Yönetim Sistemi"
  },
  {
    "id": "IMG_20260909_0012",
    "pdf": "/belgeler/IMG_20260909_0012.pdf",
    "thumb": {
      "src": "/belgeler/IMG_20260909_0012.webp",
      "width": 900,
      "height": 1274
    },
    "title": "Helal Belgesi",
    "subtitle": "TS OIC/SMIIC 1 — Helal Gıda"
  },
  {
    "id": "IMG_20260909_0007",
    "pdf": "/belgeler/IMG_20260909_0007.pdf",
    "thumb": {
      "src": "/belgeler/IMG_20260909_0007.webp",
      "width": 900,
      "height": 1274
    },
    "title": "GHP",
    "subtitle": "İyi Hijyen Uygulamaları"
  },
  {
    "id": "IMG_20260909_0005",
    "pdf": "/belgeler/IMG_20260909_0005.pdf",
    "thumb": {
      "src": "/belgeler/IMG_20260909_0005.webp",
      "width": 900,
      "height": 1274
    },
    "title": "GMP 22716:2007",
    "subtitle": "İyi Üretim Uygulamaları"
  },
  {
    "id": "IMG_20260909_0001",
    "pdf": "/belgeler/IMG_20260909_0001.pdf",
    "thumb": {
      "src": "/belgeler/IMG_20260909_0001.webp",
      "width": 900,
      "height": 1274
    },
    "title": "ISO 45001:2018",
    "subtitle": "İş Sağlığı ve Güvenliği Yönetim Sistemi"
  },
  {
    "id": "IMG_20260909_0002",
    "pdf": "/belgeler/IMG_20260909_0002.pdf",
    "thumb": {
      "src": "/belgeler/IMG_20260909_0002.webp",
      "width": 900,
      "height": 1274
    },
    "title": "ISO 14001:2026",
    "subtitle": "Çevre Yönetim Sistemi"
  },
  {
    "id": "IMG_20260909_0009",
    "pdf": "/belgeler/IMG_20260909_0009.pdf",
    "thumb": {
      "src": "/belgeler/IMG_20260909_0009.webp",
      "width": 900,
      "height": 1274
    },
    "title": "ISO 26000:2021",
    "subtitle": "Sosyal Sorumluluk Yönetim Sistemi"
  },
  {
    "id": "IMG_20260909_0011",
    "pdf": "/belgeler/IMG_20260909_0011.pdf",
    "thumb": {
      "src": "/belgeler/IMG_20260909_0011.webp",
      "width": 900,
      "height": 1274
    },
    "title": "EN ISO 15593",
    "subtitle": "Gıda Ambalajı Üretiminde Hijyen Yönetimi"
  },
  {
    "id": "IMG_20260909_0006",
    "pdf": "/belgeler/IMG_20260909_0006.pdf",
    "thumb": {
      "src": "/belgeler/IMG_20260909_0006.webp",
      "width": 900,
      "height": 1274
    },
    "title": "Gıda Uygunluk Belgesi",
    "subtitle": "EC 1935/2004 — Gıda ile Temas Eden Maddeler"
  },
  {
    "id": "IMG_20260909_0008",
    "pdf": "/belgeler/IMG_20260909_0008.pdf",
    "thumb": {
      "src": "/belgeler/IMG_20260909_0008.webp",
      "width": 900,
      "height": 1274
    },
    "title": "CE Uygunluk Beyanı",
    "subtitle": "GPSR 2023/988 Genel Ürün Güvenliği"
  }
];

export const gallery: GalleryItem[] = [
  {
    "type": "photo",
    "group": "tesis",
    "alt": "Endüstriyel üretim mutfağımız",
    "src": "/gorseller/galeri/img_7785.webp",
    "thumb": "/gorseller/galeri/thumb/img_7785.webp",
    "width": 2048,
    "height": 1536
  },
  {
    "type": "photo",
    "group": "tesis",
    "alt": "Pişirme hattı ve kazan istasyonları",
    "src": "/gorseller/galeri/img_7778.webp",
    "thumb": "/gorseller/galeri/thumb/img_7778.webp",
    "width": 2048,
    "height": 1536
  },
  {
    "type": "photo",
    "group": "tesis",
    "alt": "Büyük kapasiteli pişirme kazanları",
    "src": "/gorseller/galeri/img_7782.webp",
    "thumb": "/gorseller/galeri/thumb/img_7782.webp",
    "width": 2048,
    "height": 1536
  },
  {
    "type": "photo",
    "group": "mutfak",
    "alt": "Konveksiyonel fırında pişen tepsiler",
    "src": "/gorseller/galeri/img_7708.webp",
    "thumb": "/gorseller/galeri/thumb/img_7708.webp",
    "width": 1536,
    "height": 2048
  },
  {
    "type": "photo",
    "group": "mutfak",
    "alt": "Gastronom küvette döner ve patates",
    "src": "/gorseller/galeri/img_7727.webp",
    "thumb": "/gorseller/galeri/thumb/img_7727.webp",
    "width": 1536,
    "height": 2048
  },
  {
    "type": "photo",
    "group": "mutfak",
    "alt": "Fırına hazırlanan sebzeli kebap",
    "src": "/gorseller/galeri/img_7756.webp",
    "thumb": "/gorseller/galeri/thumb/img_7756.webp",
    "width": 1536,
    "height": 2048
  },
  {
    "type": "photo",
    "group": "mutfak",
    "alt": "Endüstriyel mutfakta hazırlık",
    "src": "/gorseller/galeri/nazas3.webp",
    "thumb": "/gorseller/galeri/thumb/nazas3.webp",
    "width": 1536,
    "height": 2048
  },
  {
    "type": "photo",
    "group": "mutfak",
    "alt": "Mutfak ekibi çalışırken",
    "src": "/gorseller/galeri/nazas9.webp",
    "thumb": "/gorseller/galeri/thumb/nazas9.webp",
    "width": 768,
    "height": 1024
  },
  {
    "type": "photo",
    "group": "mutfak",
    "alt": "Toplu yemek üretimi",
    "src": "/gorseller/galeri/nazas10.webp",
    "thumb": "/gorseller/galeri/thumb/nazas10.webp",
    "width": 768,
    "height": 1024
  },
  {
    "type": "photo",
    "group": "mutfak",
    "alt": "Porsiyonlama hattı",
    "src": "/gorseller/galeri/nazas12.webp",
    "thumb": "/gorseller/galeri/thumb/nazas12.webp",
    "width": 1200,
    "height": 1600
  },
  {
    "type": "photo",
    "group": "kumanya",
    "alt": "Kapak kapatma makinesinde hijyenik paketleme",
    "src": "/gorseller/galeri/gallery6.webp",
    "thumb": "/gorseller/galeri/thumb/gallery6.webp",
    "width": 1280,
    "height": 853
  },
  {
    "type": "photo",
    "group": "kumanya",
    "alt": "Bölmeli kaplarda porsiyonlanmış öğünler",
    "src": "/gorseller/galeri/img_7640.webp",
    "thumb": "/gorseller/galeri/thumb/img_7640.webp",
    "width": 1536,
    "height": 2048
  },
  {
    "type": "photo",
    "group": "kumanya",
    "alt": "Paketlenmeye hazır çorba ve makarna porsiyonları",
    "src": "/gorseller/galeri/img_7689.webp",
    "thumb": "/gorseller/galeri/thumb/img_7689.webp",
    "width": 2048,
    "height": 1536
  },
  {
    "type": "photo",
    "group": "kumanya",
    "alt": "Sarma, mantı ve çorba porsiyonları",
    "src": "/gorseller/galeri/img_7715.webp",
    "thumb": "/gorseller/galeri/thumb/img_7715.webp",
    "width": 2048,
    "height": 1536
  },
  {
    "type": "photo",
    "group": "kumanya",
    "alt": "Dörtlü bölmeli kumanya öğünü",
    "src": "/gorseller/galeri/img_7720.webp",
    "thumb": "/gorseller/galeri/thumb/img_7720.webp",
    "width": 1536,
    "height": 2048
  },
  {
    "type": "photo",
    "group": "kumanya",
    "alt": "Et, pilav ve çorbadan oluşan paket öğünler",
    "src": "/gorseller/galeri/img_7732.webp",
    "thumb": "/gorseller/galeri/thumb/img_7732.webp",
    "width": 1536,
    "height": 2048
  },
  {
    "type": "photo",
    "group": "kumanya",
    "alt": "Döner, pilav ve çorbalı paket öğün",
    "src": "/gorseller/galeri/img_7738.webp",
    "thumb": "/gorseller/galeri/thumb/img_7738.webp",
    "width": 1536,
    "height": 2048
  },
  {
    "type": "photo",
    "group": "kumanya",
    "alt": "Bölmeli kaplarda hazırlanmış kumanya öğünleri",
    "src": "/gorseller/galeri/nazas5.webp",
    "thumb": "/gorseller/galeri/thumb/nazas5.webp",
    "width": 960,
    "height": 1206
  },
  {
    "type": "photo",
    "group": "kumanya",
    "alt": "Paket öğün hazırlığı",
    "src": "/gorseller/galeri/nazas6.webp",
    "thumb": "/gorseller/galeri/thumb/nazas6.webp",
    "width": 1200,
    "height": 1600
  },
  {
    "type": "photo",
    "group": "kumanya",
    "alt": "Sıcak yemek kapları",
    "src": "/gorseller/galeri/nazas15.webp",
    "thumb": "/gorseller/galeri/thumb/nazas15.webp",
    "width": 1200,
    "height": 1600
  },
  {
    "type": "photo",
    "group": "kumanya",
    "alt": "Paketlenmiş öğünler",
    "src": "/gorseller/galeri/nazas18.webp",
    "thumb": "/gorseller/galeri/thumb/nazas18.webp",
    "width": 1200,
    "height": 1600
  },
  {
    "type": "photo",
    "group": "servis",
    "alt": "NAZ-AŞ logolu masada öğle yemeği tepsisi",
    "src": "/gorseller/galeri/img_7699.webp",
    "thumb": "/gorseller/galeri/thumb/img_7699.webp",
    "width": 1536,
    "height": 2048
  },
  {
    "type": "photo",
    "group": "servis",
    "alt": "Tabldot servis tepsisi",
    "src": "/gorseller/galeri/img_7705.webp",
    "thumb": "/gorseller/galeri/thumb/img_7705.webp",
    "width": 1536,
    "height": 2048
  },
  {
    "type": "photo",
    "group": "servis",
    "alt": "Sıcak yemek servisi",
    "src": "/gorseller/galeri/nazas2.webp",
    "thumb": "/gorseller/galeri/thumb/nazas2.webp",
    "width": 602,
    "height": 421
  },
  {
    "type": "photo",
    "group": "servis",
    "alt": "Günlük menü sunumu",
    "src": "/gorseller/galeri/nazas4.webp",
    "thumb": "/gorseller/galeri/thumb/nazas4.webp",
    "width": 1200,
    "height": 1600
  },
  {
    "type": "photo",
    "group": "servis",
    "alt": "Yemekhane servisi",
    "src": "/gorseller/galeri/nazas7.webp",
    "thumb": "/gorseller/galeri/thumb/nazas7.webp",
    "width": 1200,
    "height": 1600
  },
  {
    "type": "photo",
    "group": "servis",
    "alt": "Ana yemek sunumu",
    "src": "/gorseller/galeri/nazas8.webp",
    "thumb": "/gorseller/galeri/thumb/nazas8.webp",
    "width": 1200,
    "height": 1600
  },
  {
    "type": "photo",
    "group": "servis",
    "alt": "Menü çeşitleri",
    "src": "/gorseller/galeri/nazas11.webp",
    "thumb": "/gorseller/galeri/thumb/nazas11.webp",
    "width": 1200,
    "height": 1600
  },
  {
    "type": "photo",
    "group": "servis",
    "alt": "Tabldot servis hattı",
    "src": "/gorseller/galeri/nazas14.webp",
    "thumb": "/gorseller/galeri/thumb/nazas14.webp",
    "width": 1200,
    "height": 1600
  },
  {
    "type": "photo",
    "group": "servis",
    "alt": "Salata ve mezeler",
    "src": "/gorseller/galeri/nazas16.webp",
    "thumb": "/gorseller/galeri/thumb/nazas16.webp",
    "width": 1200,
    "height": 1600
  },
  {
    "type": "photo",
    "group": "servis",
    "alt": "Günün yemekleri",
    "src": "/gorseller/galeri/nazas17.webp",
    "thumb": "/gorseller/galeri/thumb/nazas17.webp",
    "width": 1200,
    "height": 1600
  },
  {
    "type": "photo",
    "group": "servis",
    "alt": "Tatlı sunumu",
    "src": "/gorseller/galeri/nazas19.webp",
    "thumb": "/gorseller/galeri/thumb/nazas19.webp",
    "width": 1200,
    "height": 1600
  },
  {
    "type": "photo",
    "group": "organizasyon",
    "alt": "Açık büfe servisinde tabaklar hazırlanıyor",
    "src": "/gorseller/galeri/nazas1.webp",
    "thumb": "/gorseller/galeri/thumb/nazas1.webp",
    "width": 1147,
    "height": 628
  },
  {
    "type": "photo",
    "group": "organizasyon",
    "alt": "Organizasyon masası düzeni",
    "src": "/gorseller/galeri/nazas13.webp",
    "thumb": "/gorseller/galeri/thumb/nazas13.webp",
    "width": 1200,
    "height": 1600
  },
  {
    "type": "photo",
    "group": "organizasyon",
    "alt": "Davet ve organizasyon servisi",
    "src": "/gorseller/galeri/nazas20.webp",
    "thumb": "/gorseller/galeri/thumb/nazas20.webp",
    "width": 1531,
    "height": 1600
  },
  {
    "type": "video",
    "group": "video",
    "alt": "Üretim mutfağından görüntüler",
    "src": "/video/galeri-7680.mp4",
    "thumb": "/gorseller/galeri/poster/galeri-7680.webp",
    "width": 720,
    "height": 1280
  },
  {
    "type": "video",
    "group": "video",
    "alt": "Porsiyonlanmış öğün kapları",
    "src": "/video/hero-7745.mp4",
    "thumb": "/gorseller/galeri/poster/hero-7745.webp",
    "width": 1080,
    "height": 870
  },
  {
    "type": "video",
    "group": "video",
    "alt": "Mutfağımızdan video 1",
    "src": "/video/nazasvideo1.mp4",
    "thumb": "/gorseller/galeri/poster/nazasvideo1.webp",
    "width": 576,
    "height": 1024
  },
  {
    "type": "video",
    "group": "video",
    "alt": "Mutfağımızdan video 2",
    "src": "/video/nazasvideo2.mp4",
    "thumb": "/gorseller/galeri/poster/nazasvideo2.webp",
    "width": 576,
    "height": 1024
  },
  {
    "type": "video",
    "group": "video",
    "alt": "Mutfağımızdan video 3",
    "src": "/video/nazasvideo3.mp4",
    "thumb": "/gorseller/galeri/poster/nazasvideo3.webp",
    "width": 576,
    "height": 1024
  }
];
