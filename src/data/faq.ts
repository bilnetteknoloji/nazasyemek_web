export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "En az kaç kişilik hizmet veriyorsunuz?",
    answer:
      "Günlük 100 öğünden başlayan kurumsal anlaşmalar yapıyoruz. Daha küçük ekipler için kumanya ve paket öğün seçeneğimiz bulunuyor.",
  },
  {
    question: "Menüler nasıl belirleniyor?",
    answer:
      "Aylık menüler diyetisyen desteğiyle, kalori ve besin dengesi gözetilerek hazırlanır. Kurumunuzun talepleri, dini ve tıbbi kısıtlar menüye işlenir; onayınız alındıktan sonra yayımlanır.",
  },
  {
    question: "Gıda güvenliği nasıl sağlanıyor?",
    answer:
      "Üretimimiz ISO 22000 gıda güvenliği yönetim sistemi ile GHP ve GMP uygulamalarına göre yürütülür. Her öğünden 72 saat şahit numune saklanır, sıcaklık kayıtları düzenli tutulur.",
  },
  {
    question: "Yemekler sıcak mı ulaşıyor?",
    answer:
      "Yemekler gıdaya uygun araçlarda, sıcaklık zinciri korunarak termobox ile taşınır. Teslim anında sıcaklık ölçümü yapılır ve forma kaydedilir.",
  },
  {
    question: "Deneme servisi yapıyor musunuz?",
    answer:
      "Evet. Sözleşme öncesinde kurumunuzda tadım ve deneme servisi düzenliyoruz; geri bildirimlere göre menüyü birlikte netleştiriyoruz.",
  },
  {
    question: "Hizmet bölgeniz neresi?",
    answer:
      "Merkezimiz Bağcılar / İstanbul'dadır ve İstanbul geneline servis veriyoruz. Şehir dışı talepleri proje bazında değerlendiriyoruz.",
  },
  {
    question: "Diyet ve alerjen ihtiyaçları karşılanıyor mu?",
    answer:
      "Diyet menüsü, glutensiz ve laktozsuz alternatifler talep üzerine hazırlanır. Alerjen bilgileri menü listelerinde belirtilir.",
  },
  {
    question: "Teklif almak ne kadar sürüyor?",
    answer:
      "Teklif formunu ilettikten sonra genellikle bir iş günü içinde dönüş yapıyor, keşif randevusu planlıyoruz.",
  },
];

/**
 * TODO: Gerçek müşteri geri bildirimleriyle değiştirilecek.
 * Aşağıdakiler yer tutucudur; yayına almadan önce müşteriden onaylı referans alınmalı.
 */
export const testimonials = [
  {
    name: "İnsan Kaynakları Müdürü",
    company: "Üretim tesisi, Bağcılar",
    quote:
      "Vardiya saatlerimize göre kurulan teslim planı sayesinde yemek molası aksamıyor. Menü çeşitliliği ve sıcaklık konusunda geri bildirim almıyoruz.",
  },
  {
    name: "İdari İşler Sorumlusu",
    company: "Lojistik firması, Esenyurt",
    quote:
      "Kumanya paketlerinin etiketlenmesi ve düzeni saha ekiplerimiz için büyük kolaylık oldu. Belgeler ve raporlama süreçleri eksiksiz ilerliyor.",
  },
  {
    name: "Okul Müdür Yardımcısı",
    company: "Özel okul, Bahçelievler",
    quote:
      "Aylık menüleri velilerle paylaşabiliyoruz; alerjen bilgilendirmesi çok net. Öğrenci memnuniyeti gözle görülür şekilde arttı.",
  },
];
