/**
 * Alt sayfa başlık bölümlerinin ortak kabuğu: sayfanın geri kalanından ayrı bir
 * blok gibi durur — yuvarlatılmış alt kenar ve alttaki bölüme düşen gölge.
 * `isolate` + `z-10`: gölge alttaki bölümün üstüne çizilir, içerideki `-z-10`
 * arka plan katmanları (HeroBackdrop) kabuğun zemininin üstünde kalır.
 */
export const heroShell =
  "relative isolate z-10 rounded-b-3xl sm:rounded-b-[3rem] shadow-[0_18px_32px_-12px_rgba(30,27,24,0.22),0_40px_72px_-28px_rgba(30,27,24,0.26)]";
