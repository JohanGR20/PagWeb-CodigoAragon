import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Logo } from "@/components/site/logo";
import { site, whatsappLink } from "@/lib/site";

const solutions = [
  { label: "Presencia web", href: "/#soluciones" },
  { label: "Automatización de ventas", href: "/#soluciones" },
  { label: "Software a medida + IA", href: "/#soluciones" },
  { label: "Panel de demostración", href: "/panel" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="pointer-events-none absolute -right-32 -top-40 size-[420px] rounded-full bg-aqua-500/10 blur-3xl" />
      <div className="container-page relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              Convertimos procesos cotidianos en herramientas digitales fáciles de usar.
              Desarrollo de software, automatización y acompañamiento para negocios locales.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">
              <span className="size-1.5 rounded-full bg-gold-400" />
              FES Aragón · UNAM
            </div>
          </div>

          <div>
            <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Navegación
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                ["Inicio", "/"],
                ["Soluciones", "/#soluciones"],
                ["Nosotros", "/#nosotros"],
                ["Proceso", "/#proceso"],
                ["Planes", "/#planes"],
                ["Contacto", "/#contacto"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-white/60 transition hover:text-gold-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Soluciones
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {solutions.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/60 transition hover:text-gold-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Hablemos
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-white/70 transition hover:text-white"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                    <MessageCircle className="size-4" />
                  </span>
                  <span>
                    WhatsApp
                    <span className="mt-0.5 block text-xs text-white/40 group-hover:text-white/60">
                      {site.whatsappDisplay}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="group flex items-start gap-3 text-white/70 transition hover:text-white"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-300">
                    <Mail className="size-4" />
                  </span>
                  <span className="break-all">
                    Correo
                    <span className="mt-0.5 block text-xs text-white/40 group-hover:text-white/60">
                      {site.email}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={site.phoneLink}
                  className="group flex items-start gap-3 text-white/70 transition hover:text-white"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/60">
                    <Phone className="size-4" />
                  </span>
                  <span>
                    Teléfono
                    <span className="mt-0.5 block text-xs text-white/40 group-hover:text-white/60">
                      {site.phoneDisplay}
                    </span>
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/50">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white/5">
                  <MapPin className="size-4" />
                </span>
                <span>
                  {site.location}
                  <span className="mt-0.5 block text-xs text-white/35">{site.hours}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Código Aragón. Proyecto de Ingeniería en Computación · FES Aragón,
            UNAM.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacidad" className="transition hover:text-white/70">
              Aviso de privacidad
            </Link>
            <Link href="/panel" className="inline-flex items-center gap-1 transition hover:text-white/70">
              Panel demo
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
