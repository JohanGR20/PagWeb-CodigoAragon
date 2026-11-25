import type { Metadata } from "next";

import { PanelShell } from "@/components/panel/panel-shell";

export const metadata: Metadata = {
  title: "Panel de demostración",
  description: "Panel de ventas, inventario y cotizaciones de Código Aragón.",
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <PanelShell>{children}</PanelShell>;
}
