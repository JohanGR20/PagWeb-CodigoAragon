"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Menu, MessageCircle, Phone } from "lucide-react";

import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { navLinks, site, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-300",
        scrolled
          ? "border-white/10 bg-navy-950/95 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          : "border-transparent bg-navy-950/70 backdrop-blur-md",
      )}
    >
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Logo variant="light" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-[13px] font-medium text-white/65 transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-[13px] font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/5 hover:text-white sm:inline-flex"
          >
            <MessageCircle className="size-4 text-[#4be28a]" />
            WhatsApp
          </Link>
          <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex">
            <Link href="/#contacto">
              Hablemos
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline-light"
                size="icon"
                className="rounded-full lg:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md border-white/10 bg-navy-950 text-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">
                  <span className="font-display">Menú</span>
                </DialogTitle>
                <DialogDescription className="text-white/60">
                  Tecnología que se adapta a tu negocio.
                </DialogDescription>
              </DialogHeader>
              <nav className="mt-2 flex flex-col" aria-label="Navegación móvil">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-white/10 py-4 text-base font-medium text-white/85 transition hover:text-gold-300"
                  >
                    <span>
                      <span className="mr-3 text-[11px] font-semibold text-gold-400/80">
                        0{index + 1}
                      </span>
                      {link.label}
                    </span>
                    <ArrowUpRight className="size-4 text-white/30" />
                  </Link>
                ))}
              </nav>
              <div className="mt-4 space-y-3">
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300"
                >
                  <MessageCircle className="size-4" />
                  Escríbenos por WhatsApp
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70"
                >
                  <Mail className="size-4 text-gold-300" />
                  {site.email}
                </a>
                <a
                  href={site.phoneLink}
                  className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70"
                >
                  <Phone className="size-4 text-gold-300" />
                  {site.phoneDisplay}
                </a>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
