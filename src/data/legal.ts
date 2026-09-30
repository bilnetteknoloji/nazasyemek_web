import type { LegalBlock } from "@/components/layout/LegalPage";
import { site } from "./site";

/**
 * Yasal metinler standart şablondur.
 * TODO: Yayına almadan önce şirketin hukuk danışmanı tarafından gözden geçirilmeli;
 * ticari unvan, VKN ve MERSİS bilgileri müşteriden alınıp eklenmeli.
 */
export const legalUpdatedAt = "10 Eylül 2026";

export const kvkkBlocks: LegalBlock[] = [
  {
    heading: "Veri sorumlusu",
    paragraphs: [
      `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu ${site.legalName}'tir. Adres: ${site.address.full}.`,
      "Bu aydınlatma metni, internet sitemiz üzerinden ilettiğiniz kişisel verilerin hangi amaçla işlendiğini açıklamak amacıyla hazırlanmıştır.",
    ],
  },
  {
    heading: "İşlenen kişisel veriler",
    paragraphs: [
      "Teklif formu ve iletişim kanallarımız aracılığıyla aşağıdaki veriler işlenmektedir:",
    ],
    list: [
      "Kimlik ve iletişim verileri: ad soyad, firma adı, telefon numarası, e-posta adresi",
      "Talep içeriğine ilişkin veriler: hizmet türü, öğün sayısı, başlangıç tarihi, mesaj metni",
      "İşlem güvenliği verileri: form gönderim tarihi ve teknik kayıtlar",
    ],
  },
  {
    heading: "İşleme amaçları ve hukuki sebep",
    paragraphs: [
      "Kişisel verileriniz; teklif hazırlanması, talebinizin yanıtlanması, sözleşme süreçlerinin yürütülmesi ve müşteri ilişkilerinin yönetilmesi amacıyla işlenir.",
      "İşleme faaliyeti, KVKK m. 5/2-(c) sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması ve m. 5/2-(f) meşru menfaat hukuki sebeplerine dayanır. Açık rızanızın gerektiği hâllerde rızanız ayrıca alınır.",
    ],
  },
  {
    heading: "Aktarım",
    paragraphs: [
      "Kişisel verileriniz, hizmetin sunulması için gerekli olduğu ölçüde barındırma ve e-posta altyapısı sağlayıcılarımızla; yasal yükümlülükler kapsamında yetkili kamu kurum ve kuruluşlarıyla paylaşılabilir. Yurt dışına aktarım, KVKK m. 9 koşulları sağlanmadan yapılmaz.",
    ],
  },
  {
    heading: "Saklama süresi",
    paragraphs: [
      "Verileriniz, işlenme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen zamanaşımı süreleri sonuna kadar saklanır; sürenin dolmasıyla silinir, yok edilir veya anonim hâle getirilir.",
    ],
  },
  {
    heading: "İlgili kişinin hakları",
    paragraphs: [
      "KVKK m. 11 uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, işlenme amacını öğrenme, düzeltilmesini veya silinmesini isteme ve zararın giderilmesini talep etme haklarına sahipsiniz.",
      `Taleplerinizi ${site.email} adresine veya yukarıdaki posta adresimize iletebilirsiniz. Başvurunuz en geç otuz gün içinde sonuçlandırılır.`,
    ],
  },
];

export const privacyBlocks: LegalBlock[] = [
  {
    heading: "Genel",
    paragraphs: [
      `${site.legalName} olarak, internet sitemizi ziyaret eden ve bizimle iletişime geçen kişilerin gizliliğine önem veriyoruz. Bu politika, hangi bilgileri topladığımızı ve nasıl kullandığımızı açıklar.`,
    ],
  },
  {
    heading: "Toplanan bilgiler",
    paragraphs: [
      "Yalnızca sizin ilettiğiniz bilgileri topluyoruz. Teklif formunu doldurmadığınız sürece kimliğinizi belirleyen bir veri kaydedilmez.",
    ],
    list: [
      "Form aracılığıyla ilettiğiniz iletişim ve talep bilgileri",
      "Sitenin çalışması için gerekli teknik kayıtlar",
    ],
  },
  {
    heading: "Bilgilerin kullanımı",
    paragraphs: [
      "Bilgileriniz yalnızca talebinize yanıt vermek, teklif hazırlamak ve hizmet sürecini yürütmek için kullanılır. Pazarlama amacıyla üçüncü taraflarla paylaşılmaz, satılmaz.",
    ],
  },
  {
    heading: "Güvenlik",
    paragraphs: [
      "Verileriniz, yetkisiz erişime karşı makul teknik ve idari tedbirlerle korunur. Site trafiği HTTPS üzerinden şifrelenir.",
    ],
  },
  {
    heading: "İletişim",
    paragraphs: [
      `Gizlilik uygulamalarımıza ilişkin sorularınızı ${site.email} adresine iletebilirsiniz.`,
    ],
  },
];

export const cookieBlocks: LegalBlock[] = [
  {
    heading: "Çerez nedir?",
    paragraphs: [
      "Çerezler, ziyaret ettiğiniz internet siteleri tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır. Sitenin düzgün çalışmasına ve deneyiminizin iyileştirilmesine yardımcı olurlar.",
    ],
  },
  {
    heading: "Kullandığımız çerezler",
    paragraphs: [
      "Sitemizde yalnızca sitenin çalışması için gerekli olan zorunlu çerezler kullanılmaktadır. Reklam veya profilleme amaçlı çerez kullanılmaz.",
    ],
    list: [
      "Zorunlu çerezler: oturum ve güvenlik amacıyla kullanılır, kapatılamaz.",
      "Gömülü içerik: harita gibi üçüncü taraf içerikler kendi çerezlerini yerleştirebilir.",
    ],
  },
  {
    heading: "Çerezleri yönetme",
    paragraphs: [
      "Tarayıcınızın ayarlar bölümünden çerezleri silebilir veya engelleyebilirsiniz. Zorunlu çerezlerin engellenmesi hâlinde sitenin bazı bölümleri çalışmayabilir.",
    ],
  },
];
