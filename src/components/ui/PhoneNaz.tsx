import { site } from "@/data/site";

/**
 * Numara "0212 470 1 629" biçiminde; son üç hanenin (629) hemen altında tuş takımındaki
 * karşılığı "(NAZ)" çok küçük, kalın ve kırmızı yazılır. Satır yüksekliğini bozmamak için
 * mutlak konumlu.
 */
export function PhoneNaz({
  display,
  label,
}: {
  display: string;
  /** Ekran okuyucu için okunacak numara. */
  label: string;
}) {
  const digits = display.split(" ");
  const last = digits.pop();
  // Numara panelden değiştirilip 629 ile bitmiyorsa NAZ karşılığı yazılmaz.
  if (last !== "629") return <span aria-label={label}>{display}</span>;
  return (
    <span className="inline-block pb-1.5" aria-label={label}>
      <span aria-hidden>
        {digits.join(" ")}{" "}
        <span className="relative inline-block">
          {last}
          <span className="absolute top-[88%] left-1/2 -translate-x-1/2 text-[0.5rem] leading-none font-extrabold tracking-wide whitespace-nowrap text-red-600">
            ({site.phoneMnemonic})
          </span>
        </span>
      </span>
    </span>
  );
}
