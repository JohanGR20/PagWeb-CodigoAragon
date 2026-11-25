import { Badge } from "@/components/ui/badge";
import { cn, statusLabel, statusStyles } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wide", statusStyles[status])}
    >
      {statusLabel(status)}
    </Badge>
  );
}
