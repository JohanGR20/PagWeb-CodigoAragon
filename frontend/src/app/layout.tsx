import type { Metadata, Viewport } from "next";

import "@fontsource-variable/manrope";
import "@fontsource-variable/fraunces";
import "./globals.css";

import { Providers } from "@/components/providers";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://codigoaragon.mx"),
  title: {
    default: "Código Aragón | Tecnología que se adapta a tu negocio",
    template: "%s | Código Aragón",
  },
  description: site.description,
  keywords: [
    "desarrollo de software CDMX",
    "automatización de ventas",
    "software a medida",
    "digitalización de negocios",
    "inventario",
    "Código Aragón",
    "FES Aragón",
  ],
  authors: [{ name: "Código Aragón" }],
  creator: "Código Aragón",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://codigoaragon.mx",
    siteName: "Código Aragón",
    title: "Código Aragón | Tecnología que se adapta a tu negocio",
    description: site.description,
    images: [{ url: "/logo.jpeg", width: 796, height: 765, alt: "Código Aragón" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Código Aragón | Tecnología que se adapta a tu negocio",
    description: site.description,
    images: ["/logo.jpeg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#061828",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-cream font-sans text-navy-950 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
