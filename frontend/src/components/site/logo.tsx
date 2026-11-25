import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "dark" | "light";
  compact?: boolean;
  className?: string;
  href?: string;
}

export function Logo({ variant = "dark", compact = false, className, href = "/" }: LogoProps) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-3", className)}>
      <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_4px_18px_-6px_rgba(7,27,51,0.35)] ring-1 ring-navy-950/10 transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/emblem.png"
          alt="Emblema de Código Aragón"
          width={48}
          height={48}
          className="size-11 object-contain"
          priority
        />
      </span>
      <span className="flex flex-col">
        <span
          className={cn(
            "font-display text-[21px] font-semibold leading-none tracking-tight whitespace-nowrap",
            variant === "light" ? "text-white" : "text-navy-950",
          )}
        >
          Código Aragón
        </span>
        {!compact && (
          <span
            className={cn(
              "mt-1.5 text-[8.5px] font-bold uppercase tracking-[0.26em]",
              variant === "light" ? "text-gold-300/90" : "text-gold-600",
            )}
          >
            Tecnología que se adapta
          </span>
        )}
      </span>
    </Link>
  );
}
