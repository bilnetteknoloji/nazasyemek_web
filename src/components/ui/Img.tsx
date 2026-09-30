import NextImage from "next/image";
import { asset } from "@/lib/asset";

/**
 * next/image sarmalayıcısı: src'ye basePath ekler.
 * Alt klasöre yüklenen derlemelerde görsellerin 404 vermemesi için
 * bileşenlerde doğrudan `next/image` yerine bu kullanılır.
 */
export function Img({ src, ...props }: React.ComponentProps<typeof NextImage>) {
  return <NextImage {...props} src={typeof src === "string" ? asset(src) : src} />;
}
