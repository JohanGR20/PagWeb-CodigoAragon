import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em]",
          align === "center" && "justify-center",
          dark ? "text-gold-300" : "text-gold-600",
        )}
      >
        <span className={cn("h-px w-8", dark ? "bg-gold-400/50" : "bg-gold-500/50")} />
        {eyebrow}
      </div>
      <h2
        className={cn(
          "mt-5 font-display text-[36px] leading-[1.03] tracking-[-0.03em] sm:text-[46px] lg:text-[54px]",
          dark ? "text-white" : "text-navy-950",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-[15px] leading-relaxed sm:text-base",
            align === "center" && "mx-auto",
            dark ? "text-white/55" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
