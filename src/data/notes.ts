import { site } from "./site";

/**
 * Menü ve Üretim sayfalarındaki "kullanım talimatı" notları.
 * Kartta `summary` görünür, "Tamamını okuyun" ile tüm metin pop-up'ta açılır.
 *
 * Metinler genel gıda güvenliği ve ziyaretçi hijyeni kurallarıdır; firmaya özel
 * rakam veya iddia içermez. Kuruma özel koşullar sözleşmede ayrıca belirtilir.
 */

export type UsageNoteContent = {
  eyebrow: string;
  title: string;
  summary: string;
  sections: { heading: string; text: string }[];
  footer: string;
};

export const mealUsageNote: UsageNoteContent = {
  eyebrow: "Kullanım Talimatı",
  title: "Öğün Kullanım ve Saklama Talimatı",
  summary:
    "Teslim aldığınız öğünlerin lezzetini ve güvenliğini korumak için teslim alma, saklama, ısıtma ve servis sırasında dikkat edilmesi gerekenleri kısaca derledik.",
  sections: [
    {
      heading: "Teslim alırken",
      text: "Kapların kapaklarının kapalı, ambalajların sağlam olduğunu ve sıcak yemeklerin kapalı termobox içinde geldiğini kontrol edin. Açılmış ya da hasarlı bir ambalaj fark ederseniz teslim almadan önce servis görevlisine bildirin.",
    },
    {
      heading: "Sıcak öğünler",
      text: "Termobox'ları servis anına kadar kapalı tutun ve öğünleri bekletmeden servis edin. Pişmiş yemekleri oda sıcaklığında iki saatten uzun süre bırakmayın.",
    },
    {
      heading: "Soğuk ürünler",
      text: "Salata, meze, tatlı ve içecekleri servise kadar buzdolabında (0–4 °C) saklayın; güneş alan ya da ısı kaynağına yakın yerlerde bekletmeyin.",
    },
    {
      heading: "Yeniden ısıtma",
      text: "Paket öğünleri ambalaj üzerindeki uyarılara göre ısıtın; mikrodalgada ısıtmadan önce plastik kapağı çıkarın. Yemeği her noktası iyice ısınana kadar ısıtın ve bir kez ısıtılan yemeği tekrar ısıtmayın.",
    },
    {
      heading: "Alerjen ve özel diyet",
      text: "Alerji ya da özel diyet ihtiyaçlarını bize önceden bildirin. Kişiye özel etiketlenmiş öğünleri yalnızca ilgili kişiye servis edin.",
    },
    {
      heading: "Artan yemekler",
      text: "Servis sonunda artan yemekleri bir sonraki öğünde kullanmak üzere saklamayın.",
    },
    {
      heading: "Bir sorun fark ederseniz",
      text: `Tat, koku, görünüm ya da sıcaklıkta olağan dışı bir durum görürseniz o ürünün servisini durdurun, mümkünse ürünü ambalajıyla birlikte ayırın ve ${site.phone} numarasından bize hemen ulaşın.`,
    },
  ],
  footer:
    "Kurumunuza özel teslim saatleri, servis düzeni ve saklama koşulları hizmet sözleşmesinde ve servis planında ayrıca belirtilir.",
};

export const facilityVisitNote: UsageNoteContent = {
  eyebrow: "Ziyaretçi Talimatı",
  title: "Tesis Ziyareti ve Hijyen Kuralları",
  summary:
    "Üretim tesisimizi görmek isteyen kurum temsilcilerini memnuniyetle ağırlıyoruz. Gıda güvenliğini korumak için ziyaretlerde uyguladığımız kuralları aşağıda bulabilirsiniz.",
  sections: [
    {
      heading: "Randevu ve refakat",
      text: "Ziyaretler önceden alınan randevuyla ve ekibimizden bir refakatçi eşliğinde yapılır.",
    },
    {
      heading: "Sağlık durumu",
      text: "Ateş, ishal, kusma, açık yara ya da bulaşıcı bir hastalık belirtisi varsa ziyaretinizi başka bir güne erteleyin.",
    },
    {
      heading: "Koruyucu ekipman",
      text: "Üretim alanına bone, önlük ve galoş giyilerek girilir; gerekli ekipman tesis girişinde verilir.",
    },
    {
      heading: "El hijyeni",
      text: "Üretim alanına girmeden önce eller yıkanır ve dezenfekte edilir.",
    },
    {
      heading: "Kişisel eşyalar",
      text: "Takı, saat ve telefon gibi eşyalar üretim alanı dışında bırakılır. Üretim alanında yiyecek, içecek ve sakız tüketilmez.",
    },
    {
      heading: "Fotoğraf ve video",
      text: "Üretim alanında fotoğraf ve video çekimi yalnızca refakatçinin izniyle yapılabilir.",
    },
    {
      heading: "Tesis içinde",
      text: "Belirlenen ziyaret güzergâhının dışına çıkılmaz; ekipmanlara, hammaddeye ve hazır ürünlere dokunulmaz.",
    },
  ],
  footer: `Ziyaret randevusu için ${site.phone} numarasından ya da ${site.email} adresinden bize ulaşabilirsiniz.`,
};
