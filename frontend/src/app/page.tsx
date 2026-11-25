import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Check,
  CheckCircle2,
  Clock,
  CloudUpload,
  Code2,
  Database,
  FileSpreadsheet,
  FileText,
  Globe2,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  PenTool,
  Phone,
  Quote,
  ReceiptText,
  Search,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Users,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

import { ContactForm } from "@/components/site/contact-form";
import { FaqSection } from "@/components/site/faq";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { HeroDashboard } from "@/components/site/hero-dashboard";
import { MarketChart } from "@/components/site/market-chart";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { Button } from "@/components/ui/button";
import { site, whatsappLink } from "@/lib/site";
import { cn, initials } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Código Aragón | Tecnología que se adapta a tu negocio",
  description:
    "Desarrollo de software, automatización de ventas y acompañamiento digital para microempresas y negocios locales de la CDMX. Diagnóstico inicial sin costo.",
};

const problems = [
  {
    number: "01",
    icon: FileSpreadsheet,
    title: "Procesos manuales",
    description:
      "Registros en papel, hojas de cálculo dispersas y tareas repetitivas que consumen tiempo y abren la puerta a errores.",
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Ventas desorganizadas",
    description:
      "Pedidos difíciles de seguir, falta de control de inventario y poca presencia digital para atraer nuevos clientes.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Miedo al cambio",
    description:
      "Presupuesto limitado, poca experiencia tecnológica y temor a perder el control de lo que ya funciona.",
  },
];

const solutions = [
  {
    number: "01",
    icon: Globe2,
    title: "Presencia web",
    kicker: "Tu negocio, visible",
    description:
      "Sitios responsivos, catálogo, contacto y menú o catálogo por QR para que tus clientes te encuentren y te contacten fácilmente.",
    features: ["Sitio web responsivo", "Catálogo y formulario de contacto", "Menú o catálogo por QR"],
    ideal: "Negocios que aún no tienen presencia digital.",
  },
  {
    number: "02",
    icon: Workflow,
    title: "Automatización de ventas",
    kicker: "Menos caos, más control",
    description:
      "Registro de pedidos, inventario, clientes y reportes en una sola herramienta. Aplicaciones web progresivas que funcionan en cualquier dispositivo.",
    features: ["Pedidos, ventas y clientes", "Inventario y reportes visuales", "Aplicaciones web progresivas (PWA)"],
    ideal: "Comercios con pedidos diarios y stock que controlar.",
    highlighted: true,
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Software a medida + IA",
    kicker: "Hecho para tu proceso",
    description:
      "Flujos específicos, integraciones, asistentes y automatización según la viabilidad de cada caso. Nada de funciones de más.",
    features: ["Flujos y módulos específicos", "Integraciones con tus herramientas", "Asistentes y automatización con IA"],
    ideal: "Procesos que no encajan en plantillas genéricas.",
  },
];

const values = [
  {
    number: "01",
    icon: HeartHandshake,
    title: "Sencillez",
    description:
      "Interfaces intuitivas, lenguaje cotidiano y aprendizaje guiado. El cliente no necesita saber programar.",
  },
  {
    number: "02",
    icon: Palette,
    title: "Personalización",
    description:
      "Diseñamos según tu flujo de trabajo, sin imponer funciones innecesarias ni cambiar tu forma de operar.",
  },
  {
    number: "03",
    icon: Users,
    title: "Acompañamiento",
    description:
      "Capacitación, soporte y mejoras graduales dentro del alcance acordado. Un aliado cercano, no solo un proveedor.",
  },
];

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Diagnóstico",
    description: "Entendemos tus procesos, tus problemas y lo que realmente necesitas.",
  },
  {
    number: "02",
    icon: PenTool,
    title: "Prototipo",
    description: "Diseñamos y validamos la solución antes de escribir código.",
  },
  {
    number: "03",
    icon: Code2,
    title: "Desarrollo",
    description: "Construimos con Python, JavaScript y pruebas constantes.",
  },
  {
    number: "04",
    icon: CloudUpload,
    title: "Despliegue",
    description: "Configuramos la nube, los datos y todo lo necesario para operar.",
  },
  {
    number: "05",
    icon: GraduationCap,
    title: "Capacitación",
    description: "Entregamos, formamos a tu equipo y damos soporte continuo.",
  },
];

const plans = [
  {
    name: "SaaS / Suscripción",
    label: "Para empezar",
    price: "$2,000",
    priceNote: "instalación inicial",
    recurring: "+ $1,000 / mes",
    description:
      "Ideal si quieres arrancar con un desembolso bajo y mantener tu sistema actualizado.",
    features: [
      "Instalación y puesta en marcha",
      "Hosting y mantenimiento",
      "Soporte dentro del alcance",
      "Mejoras graduales",
    ],
    highlighted: false,
  },
  {
    name: "A medida",
    label: "Proyecto completo",
    price: "$12,000",
    priceNote: "pago único",
    recurring: "Ejemplo de proyecto completo",
    description:
      "Para procesos específicos que necesitan una solución propia, diseñada alrededor de tu operación.",
    features: [
      "Desarrollo a la medida",
      "Entrega y capacitación",
      "Garantía de arranque",
      "Documentación del sistema",
    ],
    highlighted: true,
  },
  {
    name: "Híbrido",
    label: "Acompañamiento continuo",
    price: "$14,700",
    priceNote: "desarrollo inicial",
    recurring: "+ $1,200 / mes",
    description:
      "Desarrollo inicial más una póliza de soporte y hosting para crecer acompañado.",
    features: [
      "Desarrollo inicial a medida",
      "Póliza de soporte y hosting",
      "Acompañamiento continuo",
      "Mejoras por etapas",
    ],
    highlighted: false,
  },
];

const team = [
  {
    name: "Cristian Daniel De Lucio Lira",
    initials: "CD",
    role: "Dirección y ventas B2B",
    focus: "Estrategia, clientes y seguimiento.",
    gradient: "from-navy-900 via-navy-800 to-navy-700",
  },
  {
    name: "Johan Sánchez",
    initials: "JS",
    role: "Líder de desarrollo full-stack",
    focus: "Arquitectura, backend y frontend.",
    gradient: "from-[#0b3b52] via-[#0e5d74] to-[#0e7490]",
  },
  {
    name: "Eduardo Martínez",
    initials: "EM",
    role: "Diseño UX y arquitectura",
    focus: "Experiencia, prototipos y validación.",
    gradient: "from-[#3b2f1c] via-[#7a5e2a] to-[#a9822f]",
  },
  {
    name: "Iván Vicente",
    initials: "IV",
    role: "Soporte y operaciones",
    focus: "Implementación, soporte y continuidad.",
    gradient: "from-[#123b3b] via-[#155e63] to-[#0e7490]",
  },
];

function ProblemCard({
  problem,
}: {
  problem: (typeof problems)[number];
}) {
  const Icon = problem.icon;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[24px] border border-navy-950/[0.07] bg-white p-7 shadow-[0_18px_50px_-35px_rgba(7,27,51,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(7,27,51,0.28)]">
      <div className="flex items-start justify-between">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-cream text-navy-800 transition-colors group-hover:bg-gold-200/60">
          <Icon className="size-5" />
        </span>
        <span className="font-display text-4xl font-light text-navy-950/[0.12]">
          {problem.number}
        </span>
      </div>
      <h3 className="mt-7 font-display text-[24px] text-navy-950">{problem.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {problem.description}
      </p>
    </article>
  );
}

function SolutionCard({ solution }: { solution: (typeof solutions)[number] }) {
  const Icon = solution.icon;
  const highlighted = solution.highlighted;
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[26px] border p-7 transition-all duration-300 hover:-translate-y-1.5 sm:p-8",
        highlighted
          ? "border-gold-400/25 bg-navy-950 text-white shadow-[0_35px_80px_-40px_rgba(7,27,51,0.8)]"
          : "border-navy-950/[0.08] bg-white shadow-[0_20px_60px_-45px_rgba(7,27,51,0.35)] hover:shadow-[0_28px_70px_-40px_rgba(7,27,51,0.28)]",
      )}
    >
      {highlighted && (
        <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-aqua-500/10 blur-3xl" />
      )}
      <div className="relative flex items-center justify-between">
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-2xl",
            highlighted ? "bg-gold-400 text-navy-950" : "bg-cream text-navy-800",
          )}
        >
          <Icon className="size-5" />
        </span>
        <span
          className={cn(
            "font-display text-4xl font-light",
            highlighted ? "text-white/15" : "text-navy-950/[0.12]",
          )}
        >
          {solution.number}
        </span>
      </div>

      <p
        className={cn(
          "relative mt-8 text-[10px] font-bold uppercase tracking-[0.2em]",
          highlighted ? "text-gold-300" : "text-gold-600",
        )}
      >
        {solution.kicker}
      </p>
      <h3
        className={cn(
          "relative mt-2 font-display text-[27px] leading-tight",
          highlighted ? "text-white" : "text-navy-950",
        )}
      >
        {solution.title}
      </h3>
      <p
        className={cn(
          "relative mt-3 text-sm leading-relaxed",
          highlighted ? "text-white/60" : "text-muted-foreground",
        )}
      >
        {solution.description}
      </p>

      <ul className="relative mt-6 space-y-3">
        {solution.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-[13px]">
            <span
              className={cn(
                "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full",
                highlighted ? "bg-gold-400/15 text-gold-300" : "bg-emerald-50 text-emerald-600",
              )}
            >
              <Check className="size-3" />
            </span>
            <span className={highlighted ? "text-white/75" : "text-navy-800"}>{feature}</span>
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "relative mt-auto pt-8",
          highlighted ? "text-white/45" : "text-muted-foreground",
        )}
      >
        <p
          className={cn(
            "mt-0 border-t pt-5 text-xs leading-relaxed",
            highlighted ? "border-white/10" : "border-navy-950/10",
          )}
        >
          <span className={cn("font-semibold", highlighted ? "text-white/80" : "text-navy-800")}>
            Ideal para:
          </span>{" "}
          {solution.ideal}
        </p>
        <Link
          href="#contacto"
          className={cn(
            "mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold transition",
            highlighted ? "text-gold-300 hover:text-gold-200" : "text-navy-950 hover:text-gold-600",
          )}
        >
          Hablemos de esto
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

function ProcessStep({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const Icon = step.icon;
  return (
    <div className="relative">
      <div className="flex items-center gap-3 lg:flex-col lg:items-start">
        <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-gold-400/40 bg-cream text-gold-600 shadow-[0_0_0_6px_#ffffff]">
          <Icon className="size-5" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600 lg:mt-5">
          Paso {step.number}
        </span>
      </div>
      <h3 className="mt-4 font-display text-xl text-navy-950 lg:mt-2">{step.title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{step.description}</p>
      {index < steps.length - 1 && (
        <div className="absolute left-6 top-12 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-gold-400/40 to-transparent lg:hidden" />
      )}
    </div>
  );
}

function PricingCard({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[26px] border p-7 transition-all duration-300 hover:-translate-y-1 sm:p-8",
        plan.highlighted
          ? "border-gold-400/30 bg-navy-950 text-white shadow-[0_35px_90px_-40px_rgba(7,27,51,0.75)]"
          : "border-navy-950/[0.08] bg-white shadow-[0_20px_50px_-40px_rgba(7,27,51,0.3)]",
      )}
    >
      {plan.highlighted && (
        <>
          <div className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-gold-400/10 blur-3xl" />
          <span className="absolute right-6 top-6 rounded-full bg-gold-400 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.16em] text-navy-950">
            Recomendado
          </span>
        </>
      )}
      <p
        className={cn(
          "text-[10px] font-bold uppercase tracking-[0.2em]",
          plan.highlighted ? "text-gold-300" : "text-gold-600",
        )}
      >
        {plan.label}
      </p>
      <h3
        className={cn(
          "mt-2 font-display text-2xl",
          plan.highlighted ? "text-white" : "text-navy-950",
        )}
      >
        {plan.name}
      </h3>
      <div className="mt-6">
        <div className="flex items-end gap-2">
          <span
            className={cn(
              "font-display text-[42px] font-semibold leading-none tracking-tight",
              plan.highlighted ? "text-white" : "text-navy-950",
            )}
          >
            {plan.price}
          </span>
          <span
            className={cn(
              "pb-1 text-[11px]",
              plan.highlighted ? "text-white/45" : "text-muted-foreground",
            )}
          >
            MXN
          </span>
        </div>
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            plan.highlighted ? "text-white/55" : "text-muted-foreground",
          )}
        >
          {plan.priceNote}
        </p>
        <p
          className={cn(
            "mt-3 text-sm font-semibold",
            plan.highlighted ? "text-gold-300" : "text-navy-800",
          )}
        >
          {plan.recurring}
        </p>
      </div>
      <p
        className={cn(
          "mt-5 text-[13px] leading-relaxed",
          plan.highlighted ? "text-white/55" : "text-muted-foreground",
        )}
      >
        {plan.description}
      </p>
      <ul className="mt-6 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-[13px]">
            <CheckCircle2
              className={cn(
                "mt-0.5 size-4 shrink-0",
                plan.highlighted ? "text-gold-300" : "text-emerald-600",
              )}
            />
            <span className={plan.highlighted ? "text-white/70" : "text-navy-800"}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        <Button
          asChild
          variant={plan.highlighted ? "gold" : "outline"}
          className="w-full"
        >
          <Link href="#contacto">
            Quiero una cotización
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function TeamCard({ member }: { member: (typeof team)[number] }) {
  return (
    <article className="group relative overflow-hidden rounded-[24px] border border-navy-950/[0.07] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-35px_rgba(7,27,51,0.35)]">
      <div
        className={cn(
          "relative flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br",
          member.gradient,
        )}
      >
        <div className="absolute inset-0 bg-grid opacity-40" />
        <span className="relative font-display text-4xl font-semibold text-white/90">
          {member.initials}
        </span>
        <span className="absolute bottom-2 right-3 font-display text-[10px] uppercase tracking-[0.2em] text-white/35">
          {initials(member.name)}
        </span>
      </div>
      <h3 className="mt-5 font-display text-lg leading-snug text-navy-950">{member.name}</h3>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-gold-600">
        {member.role}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{member.focus}</p>
    </article>
  );
}

function ContactLink({
  href,
  icon: Icon,
  label,
  value,
  hint,
  external,
  accent = "gold",
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
  external?: boolean;
  accent?: "gold" | "green" | "blue";
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          accent === "green" && "bg-emerald-400/10 text-emerald-300",
          accent === "gold" && "bg-gold-400/10 text-gold-300",
          accent === "blue" && "bg-aqua-400/10 text-aqua-300",
        )}
      >
        <Icon className="size-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
          {label}
        </span>
        <span className="mt-0.5 block break-words text-sm font-semibold text-white/85 group-hover:text-white">
          {value}
        </span>
        {hint && <span className="mt-0.5 block text-[11px] text-white/35">{hint}</span>}
      </span>
    </a>
  );
}

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Código Aragón",
    description: site.description,
    email: site.email,
    telephone: "+525615431206",
    url: "https://codigoaragon.mx",
    areaServed: ["Ciudad de México", "Estado de México"],
    knowsAbout: [
      "Desarrollo de software",
      "Automatización de ventas",
      "Inventario",
      "Aplicaciones web",
      "Inteligencia artificial",
    ],
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "FES Aragón, UNAM",
    },
  };

  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-navy-950 text-white">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
          <div className="pointer-events-none absolute -left-44 top-[-120px] size-[560px] rounded-full bg-aqua-500/15 blur-[130px]" />
          <div className="pointer-events-none absolute bottom-[-160px] right-[-100px] size-[480px] rounded-full bg-gold-500/10 blur-[120px]" />

          <div className="container-page relative grid gap-16 pb-20 pt-14 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-8 lg:pb-24 lg:pt-20">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/65 backdrop-blur">
                  <span className="size-1.5 animate-pulse rounded-full bg-aqua-400" />
                  Desarrollo de software · CDMX
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="mt-6 max-w-[720px] font-display text-[46px] leading-[0.98] tracking-[-0.04em] sm:text-[60px] lg:text-[74px]">
                  Tecnología que{" "}
                  <span className="italic text-gradient-gold">se adapta</span> a tu negocio.
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/60 sm:text-[17px]">
                  Diseñamos, implementamos y acompañamos soluciones digitales para que tu
                  negocio venda más, se organice mejor y crezca sin complicaciones.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="gold" size="lg">
                    <Link href="#contacto">
                      Solicitar diagnóstico
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline-light" size="lg">
                    <Link href="/panel">
                      Ver panel de demostración
                      <LayoutDashboard className="size-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={320}>
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-medium text-white/45">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-aqua-400" />
                    Diagnóstico sin costo
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <HeartHandshake className="size-3.5 text-gold-300" />
                    Acompañamiento real
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="size-3.5 text-emerald-300" />
                    Sin tecnicismos
                  </span>
                </div>
              </Reveal>
            </div>

            <Reveal delay={180} className="lg:pl-4">
              <HeroDashboard />
            </Reveal>
          </div>

          <div className="relative border-t border-white/10">
            <div className="container-page flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/30">
                Proyecto de
              </p>
              <div className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                <span>UNAM</span>
                <span className="size-1 rounded-full bg-gold-400/50" />
                <span>FES Aragón</span>
                <span className="size-1 rounded-full bg-gold-400/50" />
                <span>Ingeniería en Computación</span>
                <span className="size-1 rounded-full bg-gold-400/50" />
                <span>CDMX · Edomex</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEMA */}
        <section className="relative bg-cream py-20 lg:py-28">
          <div className="container-page">
            <Reveal>
              <SectionHeading
                eyebrow="01 / La necesidad"
                title={
                  <>
                    El problema no es solo{" "}
                    <span className="italic text-navy-600">tecnológico.</span>
                  </>
                }
                description="Los negocios tradicionales necesitan eficiencia, visibilidad y confianza para dar el salto digital. No se trata de comprar software, sino de resolver problemas cotidianos."
              />
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {problems.map((problem, index) => (
                <Reveal key={problem.title} delay={index * 90}>
                  <ProblemCard problem={problem} />
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <div className="mt-14 overflow-hidden rounded-[28px] bg-navy-950 text-white shadow-[0_40px_100px_-50px_rgba(7,27,51,0.75)]">
                <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative p-8 sm:p-10 lg:p-12">
                    <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-aqua-500/10 blur-3xl" />
                    <div className="relative">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-300">
                        Dato de mercado · INEGI 2024
                      </p>
                      <div className="mt-7 flex flex-wrap items-end gap-x-12 gap-y-6">
                        <div>
                          <p className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                            454 mil
                          </p>
                          <p className="mt-2 max-w-[180px] text-xs leading-relaxed text-white/45">
                            establecimientos en CDMX en 2024 (aprox.)
                          </p>
                        </div>
                        <div>
                          <p className="font-display text-5xl font-semibold tracking-tight text-gold-300 sm:text-6xl">
                            6.7%
                          </p>
                          <p className="mt-2 max-w-[190px] text-xs leading-relaxed text-white/45">
                            vendían por internet en 2023
                          </p>
                        </div>
                      </div>
                      <p className="mt-8 max-w-lg border-t border-white/10 pt-5 text-[11px] leading-relaxed text-white/35">
                        No vender en línea no equivale a carecer de toda tecnología. Es una
                        señal de oportunidad, no una estimación de clientes.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-white/10 p-8 sm:p-10 lg:border-l lg:border-t-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white/70">
                        Venta por internet en CDMX
                      </p>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white/35">
                        2018 → 2023
                      </span>
                    </div>
                    <MarketChart />
                    <p className="mt-1 text-right text-[9px] text-white/25">
                      Fuente: INEGI, Censos Económicos 2024 (resultados oportunos).
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SOLUCIONES */}
        <section id="soluciones" className="relative overflow-hidden bg-white py-20 lg:py-28">
          <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-40" />
          <div className="container-page relative">
            <Reveal>
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeading
                  eyebrow="02 / Portafolio"
                  title={
                    <>
                      Tres formas de{" "}
                      <span className="italic text-navy-600">empezar.</span>
                    </>
                  }
                  description="Paquetes adaptables al giro, presupuesto y grado de digitalización de tu negocio. Sin funciones de más."
                />
                <Link
                  href="#contacto"
                  className="hidden shrink-0 items-center gap-2 text-[13px] font-bold text-navy-950 transition hover:text-gold-600 lg:inline-flex"
                >
                  Encontrar mi solución
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {solutions.map((solution, index) => (
                <Reveal key={solution.title} delay={index * 90}>
                  <SolutionCard solution={solution} />
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-navy-950/[0.07] bg-cream/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-3 text-xs leading-relaxed text-navy-700">
                  <Wrench className="mt-0.5 size-4 shrink-0 text-gold-600" />
                  <span>
                    <span className="font-bold text-navy-950">Servicios transversales:</span>{" "}
                    instalación, capacitación, mantenimiento, hosting y soporte según contrato.
                  </span>
                </p>
                <Link
                  href="#contacto"
                  className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-navy-950 hover:text-gold-600"
                >
                  Hablemos
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* VALOR / NOSOTROS */}
        <section
          id="nosotros"
          className="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28"
        >
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
          <div className="pointer-events-none absolute -right-24 top-10 size-[420px] rounded-full bg-gold-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 size-[320px] rounded-full bg-aqua-500/10 blur-[100px]" />

          <div className="container-page relative grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <Reveal>
                <SectionHeading
                  eyebrow="03 / Propuesta de valor"
                  dark
                  title={
                    <>
                      La tecnología se adapta al cliente,{" "}
                      <span className="italic text-gradient-gold">no al revés.</span>
                    </>
                  }
                  description="Nuestro posicionamiento: ser un aliado cercano, no solo un proveedor de software. Diagnosticamos, diseñamos y acompañamos sin imponer funciones innecesarias."
                />
              </Reveal>

              <Reveal delay={120}>
                <div className="relative mt-10 rounded-[26px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur sm:p-8">
                  <Quote className="size-8 text-gold-400/50" />
                  <blockquote className="mt-4 font-display text-2xl leading-snug text-white/90 sm:text-[28px]">
                    “No vendemos software por vender. Convertimos procesos cotidianos en
                    herramientas digitales fáciles de usar.”
                  </blockquote>
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                    Código Aragón · FES Aragón
                  </p>
                </div>
              </Reveal>

              <Reveal delay={180}>
                <div className="mt-7 flex items-center gap-3 rounded-xl border border-gold-400/20 bg-gold-400/[0.06] px-4 py-3 text-xs leading-relaxed text-white/55">
                  <Zap className="size-4 shrink-0 text-gold-300" />
                  Competimos por facilidad de adopción y cercanía; no necesariamente por el
                  precio más bajo.
                </div>
              </Reveal>
            </div>

            <div className="flex flex-col justify-center">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Reveal key={value.title} delay={index * 90}>
                    <div className="group border-t border-white/10 py-7 first:border-t-0 first:pt-0 last:pb-0">
                      <div className="flex items-start gap-5">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gold-300 transition group-hover:border-gold-400/30 group-hover:bg-gold-400/10">
                          <Icon className="size-5" />
                        </span>
                        <div>
                          <div className="flex items-baseline gap-3">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-gold-400/70">
                              {value.number}
                            </span>
                            <h3 className="font-display text-xl text-white">{value.title}</h3>
                          </div>
                          <p className="mt-2 text-[13px] leading-relaxed text-white/50">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* DEMO */}
        <section className="relative overflow-hidden bg-cream py-20 lg:py-28">
          <div className="container-page grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
            <div>
              <Reveal>
                <SectionHeading
                  eyebrow="04 / Demostración"
                  title={
                    <>
                      Míralo funcionando,{" "}
                      <span className="italic text-navy-600">no en diapositivas.</span>
                    </>
                  }
                  description="Nuestro panel de demostración reúne las operaciones que más pesan en un negocio local: ventas, inventario, cotizaciones y cobranza."
                />
              </Reveal>

              <Reveal delay={100}>
                <ul className="mt-8 space-y-4">
                  {[
                    {
                      icon: LayoutDashboard,
                      text: "Ventas, inventario y clientes en un solo lugar.",
                    },
                    {
                      icon: FileText,
                      text: "Cotizaciones con cálculo automático de impuestos.",
                    },
                    {
                      icon: BarChart3,
                      text: "Reportes visuales para decidir con datos, no con intuición.",
                    },
                    {
                      icon: Boxes,
                      text: "Alertas de stock y seguimiento de cuentas por cobrar.",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.text} className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-navy-800 shadow-sm ring-1 ring-navy-950/[0.06]">
                          <Icon className="size-4" />
                        </span>
                        <span className="pt-1 text-sm leading-relaxed text-navy-800">
                          {item.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>

              <Reveal delay={160}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button asChild variant="gold">
                    <Link href="/panel">
                      Explorar el panel
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Datos ficticios de una distribuidora local.
                    <br className="hidden sm:block" /> Conectado a una API real.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <div className="relative">
                <div className="pointer-events-none absolute -inset-8 rounded-[40px] bg-gold-400/10 blur-2xl" />
                <div className="relative rounded-[28px] border border-navy-950/10 bg-white p-2.5 shadow-[0_45px_110px_-45px_rgba(7,27,51,0.55)]">
                  <div className="flex items-center gap-3 border-b border-navy-950/[0.06] px-3 py-2.5">
                    <div className="flex gap-1.5">
                      <span className="size-2 rounded-full bg-rose-300" />
                      <span className="size-2 rounded-full bg-amber-300" />
                      <span className="size-2 rounded-full bg-emerald-300" />
                    </div>
                    <div className="mx-auto flex items-center gap-2 rounded-md bg-cream px-4 py-1 text-[9px] text-navy-500">
                      <ShieldCheck className="size-2.5 text-emerald-500" />
                      codigoaragon.mx/panel
                    </div>
                    <span className="rounded-full bg-gold-200/60 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gold-600">
                      Demo
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-[20px] border border-navy-950/[0.06] bg-[#f4f6f8]">
                    <Image
                      src="/panel-preview.png"
                      alt="Vista del panel de ventas e inventario de Código Aragón"
                      width={1600}
                      height={1000}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-xl border border-navy-950/10 bg-white px-3 py-2 shadow-lg sm:flex">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="size-3.5" />
                  </span>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-navy-400">
                      Actualizado
                    </p>
                    <p className="text-[10px] font-semibold text-navy-900">Hoy, 20:25</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PROCESO */}
        <section id="proceso" className="relative bg-white py-20 lg:py-28">
          <div className="container-page">
            <Reveal>
              <SectionHeading
                eyebrow="05 / Operaciones"
                title={
                  <>
                    De la idea a una solución{" "}
                    <span className="italic text-navy-600">funcional.</span>
                  </>
                }
                description="Un método de trabajo repetible que reduce la incertidumbre y evita desarrollar a ciegas."
              />
            </Reveal>

            <div className="relative mt-14">
              <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-gold-400/10 via-gold-400/50 to-gold-400/10 lg:block" />
              <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
                {steps.map((step, index) => (
                  <Reveal key={step.title} delay={index * 80}>
                    <ProcessStep step={step} index={index} />
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={120}>
              <div className="mt-14 flex flex-col items-start gap-4 rounded-2xl border border-navy-950/[0.07] bg-cream/80 px-5 py-4 sm:flex-row sm:items-center">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-950 text-gold-300">
                  <ShieldCheck className="size-4" />
                </span>
                <p className="text-xs leading-relaxed text-navy-700">
                  <span className="font-bold text-navy-950">Controles en cada proyecto:</span>{" "}
                  alcance contractual, protección de datos, respaldos y niveles de servicio
                  (SLA).
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PLANES */}
        <section id="planes" className="relative overflow-hidden bg-cream py-20 lg:py-28">
          <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-30" />
          <div className="container-page relative">
            <Reveal>
              <SectionHeading
                align="center"
                eyebrow="06 / Inversión"
                title={
                  <>
                    Cobro flexible,{" "}
                    <span className="italic text-navy-600">ingresos claros.</span>
                  </>
                }
                description="Tres esquemas de referencia para adaptar el costo a tu presupuesto y al alcance real del proyecto. Sin sorpresas."
              />
            </Reveal>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <Reveal key={plan.name} delay={index * 90}>
                  <PricingCard plan={plan} />
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <p className="mx-auto mt-8 max-w-3xl text-center text-[11px] leading-relaxed text-muted-foreground">
                Montos de referencia del plan de negocio, en MXN. Rango general: $3,000 –
                $18,000 por desarrollo y $500 – $2,000/mes de mantenimiento. Cada proyecto se
                cotiza según alcance, licencias, impuestos y soporte. Los precios no incluyen
                IVA.
              </p>
            </Reveal>
          </div>
        </section>

        {/* EQUIPO */}
        <section id="equipo" className="bg-white py-20 lg:py-28">
          <div className="container-page">
            <Reveal>
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeading
                  eyebrow="07 / Quiénes somos"
                  title={
                    <>
                      Un equipo fundador de{" "}
                      <span className="italic text-navy-600">cuatro personas.</span>
                    </>
                  }
                  description="Ingeniería en Computación de la FES Aragón, UNAM. Trabajo remoto, comunicación directa y acompañamiento cercano."
                />
                <div className="hidden items-center gap-3 rounded-2xl border border-navy-950/[0.07] bg-cream px-4 py-3 lg:flex">
                  <GraduationCap className="size-5 text-gold-600" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-navy-500">
                      Origen
                    </p>
                    <p className="text-xs font-semibold text-navy-900">FES Aragón · UNAM</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, index) => (
                <Reveal key={member.name} delay={index * 80}>
                  <TeamCard member={member} />
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <p className="mt-8 text-center text-[11px] leading-relaxed text-muted-foreground">
                Inicio con trabajo remoto; contratación futura según carga de proyectos y
                capacidad financiera.
              </p>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-cream py-20 lg:py-28">
          <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <div>
                <SectionHeading
                  eyebrow="08 / Preguntas"
                  title={
                    <>
                      Antes de{" "}
                      <span className="italic text-navy-600">empezar.</span>
                    </>
                  }
                  description="Lo que suelen preguntarnos los dueños de negocios antes de dar el primer paso."
                />
                <div className="mt-8 rounded-2xl border border-navy-950/[0.07] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(7,27,51,0.3)]">
                  <p className="font-display text-xl text-navy-950">¿Prefieres hablarlo directo?</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Escríbenos por WhatsApp y revisamos tu caso sin compromiso.
                  </p>
                  <Button asChild variant="whatsapp" size="sm" className="mt-4 w-full">
                    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="size-4" />
                      Abrir WhatsApp
                    </a>
                  </Button>
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-3 flex items-center justify-center gap-2 text-[11px] font-semibold text-navy-500 hover:text-navy-950"
                  >
                    <Mail className="size-3.5" />
                    {site.email}
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-2xl border border-navy-950/[0.07] bg-white px-6 shadow-[0_20px_60px_-45px_rgba(7,27,51,0.35)] sm:px-8">
                <FaqSection />
              </div>
            </Reveal>
          </div>
        </section>

        {/* CONTACTO */}
        <section
          id="contacto"
          className="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28"
        >
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
          <div className="pointer-events-none absolute -left-40 bottom-0 size-[480px] rounded-full bg-aqua-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute -right-32 top-0 size-[420px] rounded-full bg-gold-500/10 blur-[110px]" />

          <div className="container-page relative grid gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
            <div>
              <Reveal>
                <SectionHeading
                  dark
                  eyebrow="09 / Contacto"
                  title={
                    <>
                      Empecemos por{" "}
                      <span className="italic text-gradient-gold">escuchar.</span>
                    </>
                  }
                  description="Cuéntanos qué procesos quieres mejorar. Te respondemos con un diagnóstico breve y una propuesta clara, sin tecnicismos."
                />
              </Reveal>

              <Reveal delay={100}>
                <div className="mt-9 grid gap-3 sm:grid-cols-2">
                  <ContactLink
                    href={whatsappLink()}
                    external
                    icon={MessageCircle}
                    label="WhatsApp"
                    value={site.whatsappDisplay}
                    hint="La forma más rápida"
                    accent="green"
                  />
                  <ContactLink
                    href={`mailto:${site.email}`}
                    icon={Mail}
                    label="Correo"
                    value={site.email}
                    hint="Respuesta en 24 h hábiles"
                    accent="gold"
                  />
                  <ContactLink
                    href={site.phoneLink}
                    icon={Phone}
                    label="Teléfono"
                    value={site.phoneDisplay}
                    hint="Llamadas y mensajes"
                    accent="blue"
                  />
                  <ContactLink
                    href="#contacto"
                    icon={MapPin}
                    label="Dónde estamos"
                    value={site.location}
                    hint="Trabajo remoto disponible"
                    accent="gold"
                  />
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
                  <Clock className="mt-0.5 size-4 shrink-0 text-gold-300" />
                  <div>
                    <p className="text-xs font-semibold text-white/80">Horario de atención</p>
                    <p className="mt-0.5 text-[11px] text-white/40">
                      {site.hours} · Sábados con cita previa
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={220}>
                <div className="mt-8 hidden items-center gap-4 lg:flex">
                  <div className="flex -space-x-2">
                    {["CD", "JS", "EM", "IV"].map((initials, index) => (
                      <span
                        key={initials}
                        className="flex size-8 items-center justify-center rounded-full border-2 border-navy-950 bg-gradient-to-br from-navy-700 to-navy-500 text-[9px] font-bold text-white"
                        style={{ zIndex: 10 - index }}
                      >
                        {initials}
                      </span>
                    ))}
                  </div>
                  <p className="max-w-xs text-[11px] leading-relaxed text-white/35">
                    Un equipo pequeño, cercano y directo. Sin intermediarios.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <ContactForm />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
      <WhatsAppFloat />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
