import { MessageCircle } from "lucide-react";

import { whatsappLink } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-0 overflow-hidden rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_18px_40px_-10px_rgba(37,211,102,0.65)] transition-all duration-300 hover:gap-2 hover:pr-5 sm:bottom-7 sm:right-7"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
      <MessageCircle className="size-6 shrink-0" />
      <span className="max-w-0 whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[130px] group-hover:opacity-100">
        Escríbenos
      </span>
    </a>
  );
}
