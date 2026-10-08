import { Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { adminButton } from "@/features/admin/ui/button";
import { whatsappHref } from "@/features/admin/ui/format";

/** Ara / WhatsApp / E-posta kısayolları (WhatsApp Business uygulamasında açılır). */
export function ReachButtons({
  phone,
  email,
  size = "sm",
}: {
  phone: string | null;
  email: string | null;
  size?: "sm" | "md";
}) {
  if (!phone && !email) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {phone ? (
        <>
          <a href={`tel:${phone}`} className={adminButton({ variant: "secondary", size })}>
            <Phone aria-hidden />
            Ara
          </a>
          <a href={whatsappHref(phone)} target="_blank" rel="noreferrer" className={adminButton({ variant: "secondary", size })}>
            <WhatsAppIcon className="size-4 text-[#25D366]" />
            WhatsApp
          </a>
        </>
      ) : null}
      {email ? (
        <a href={`mailto:${email}`} className={adminButton({ variant: "secondary", size })}>
          <Mail aria-hidden />
          E-posta
        </a>
      ) : null}
    </div>
  );
}
