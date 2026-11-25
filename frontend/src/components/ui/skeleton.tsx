import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-navy-950/[0.07]", className)}
      {...props}
    />
  );
}

export { Skeleton };
