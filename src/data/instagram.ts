/**
 * Galeri → Instagram bölümünde resmi Instagram gömme koduyla gösterilen paylaşımlar.
 * Gönderi veya reels bağlantısını olduğu gibi ekleyin, ör.
 *   "https://www.instagram.com/p/XXXXXXXXXXX/"
 *   "https://www.instagram.com/reel/XXXXXXXXXXX/"
 * Sıra = sitedeki sıra. Story'ler Instagram tarafından gömülemiyor (24 saatte siliniyor);
 * kalıcı olması istenen story'ler öne çıkanlara alınsa da gömülemez — gönderi/reels olarak paylaşılmalı.
 * Liste boşken bölüm yalnızca profil kartını gösterir. Uydurma bağlantı eklemeyin.
 */
export const instagramPosts: string[] = [];
