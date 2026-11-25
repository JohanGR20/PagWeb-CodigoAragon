import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, ShieldCheck } from "lucide-react";

import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description:
    "Aviso de privacidad de Código Aragón: qué datos recabamos, para qué los usamos y cómo ejercer tus derechos.",
};

const sections = [
  {
    title: "1. Responsable de los datos",
    body: [
      "Código Aragón, proyecto de Ingeniería en Computación de la FES Aragón, UNAM, es responsable del tratamiento de los datos personales que nos compartes a través de este sitio, del formulario de contacto y de nuestros canales de atención.",
      `Para cualquier asunto relacionado con tus datos puedes escribirnos a ${site.email} o al teléfono ${site.phoneDisplay}.`,
    ],
  },
  {
    title: "2. Datos que recabamos",
    body: [
      "A través del formulario de contacto recabamos: nombre, nombre del negocio (opcional), correo electrónico, teléfono, servicio de interés, rango de presupuesto (opcional) y el mensaje que decidas escribirnos.",
      "También podemos registrar datos derivados de la conversación posterior, como necesidades del negocio, alcance del proyecto y acuerdos de seguimiento.",
      "Este sitio no solicita datos personales sensibles ni información financiera. Te pedimos no incluir datos confidenciales en el mensaje inicial.",
    ],
  },
  {
    title: "3. Finalidades del tratamiento",
    body: [
      "Utilizamos tus datos para: (a) responder a tu solicitud de diagnóstico o información; (b) dar seguimiento a la conversación y elaborar una propuesta; (c) contactarte por correo, teléfono o WhatsApp sobre el servicio que te interesa; y (d) llevar un registro interno de prospectos y clientes.",
      "No utilizamos tus datos para publicidad de terceros ni los vendemos o rentamos.",
    ],
  },
  {
    title: "4. Transferencias y encargados",
    body: [
      "Para operar este sitio podemos apoyarnos en proveedores de infraestructura, hosting, correo electrónico y mensajería. Estos proveedores tratan la información únicamente para prestar el servicio y conforme a sus propias políticas.",
      "No realizamos transferencias de datos personales a terceros distintos de los encargados necesarios para la operación, salvo obligación legal.",
    ],
  },
  {
    title: "5. Conservación",
    body: [
      "Conservamos los datos de contacto mientras exista una relación o interés comercial y durante el tiempo necesario para atender posibles responsabilidades. Si solicitas la eliminación, procederemos salvo que exista una obligación legal de conservarlos.",
    ],
  },
  {
    title: "6. Derechos ARCO",
    body: [
      "Puedes ejercer tus derechos de acceso, rectificación, cancelación u oposición al tratamiento de tus datos enviando una solicitud a nuestro correo. Incluye tu nombre, el derecho que deseas ejercer y un medio para contactarte.",
      "También puedes solicitar la limitación del uso o la revocación de tu consentimiento para recibir comunicaciones.",
    ],
  },
  {
    title: "7. Seguridad",
    body: [
      "Aplicamos medidas razonables de seguridad administrativa y técnica para proteger la información. Ningún sistema es completamente infalible; si detectamos un incidente relevante, actuaremos para contenerlo y comunicarlo conforme corresponda.",
    ],
  },
  {
    title: "8. Cookies y tecnologías similares",
    body: [
      "Este sitio puede usar almacenamiento técnico necesario para su funcionamiento. No utilizamos cookies publicitarias ni de perfilamiento. Si en el futuro incorporamos analítica, actualizaremos este aviso.",
    ],
  },
  {
    title: "9. Cambios al aviso",
    body: [
      "Podemos actualizar este aviso para reflejar cambios en nuestras prácticas o en la normativa aplicable. La versión vigente estará publicada en esta página con su fecha de actualización.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-navy-950 pb-16 pt-14 text-white">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
          <div className="pointer-events-none absolute -right-32 -top-24 size-[420px] rounded-full bg-gold-500/10 blur-[110px]" />
          <div className="container-page relative">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[11px] font-semibold text-white/50 transition hover:text-white"
            >
              <ArrowLeft className="size-3.5" />
              Volver al inicio
            </Link>
            <div className="mt-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-gold-300">
              <span className="h-px w-8 bg-gold-400/50" />
              Legal
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-[42px] leading-[1.02] tracking-[-0.03em] sm:text-[56px]">
              Aviso de <span className="italic text-gradient-gold">privacidad.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/55">
              Queremos que sepas qué información recabamos, para qué la usamos y cómo puedes
              ejercer tus derechos. Última actualización: noviembre de 2026.
            </p>
          </div>
        </section>

        <section className="bg-cream py-16 lg:py-20">
          <div className="container-page grid gap-10 lg:grid-cols-[1fr_300px] lg:gap-16">
            <div className="rounded-3xl border border-navy-950/[0.07] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(7,27,51,0.4)] sm:p-9">
              <div className="space-y-8">
                {sections.map((section) => (
                  <div key={section.title}>
                    <h2 className="font-display text-xl text-navy-950">{section.title}</h2>
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 40)}
                        className="mt-3 text-[13px] leading-relaxed text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-navy-950/[0.07] bg-white p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="size-5" />
                </span>
                <h2 className="mt-4 font-display text-xl text-navy-950">Tus datos, claros</h2>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  Solo usamos tu información para responder a tu solicitud. No la vendemos ni
                  la compartimos con anunciantes.
                </p>
              </div>
              <div className="rounded-2xl border border-navy-950/[0.07] bg-navy-950 p-5 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-300">
                  Contacto de privacidad
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-3 flex items-center gap-2 break-all text-xs font-semibold text-white/85 hover:text-white"
                >
                  <Mail className="size-4 shrink-0 text-gold-300" />
                  {site.email}
                </a>
                <a
                  href={whatsappLink("Hola, tengo una duda sobre el aviso de privacidad.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-2 text-xs font-semibold text-white/85 hover:text-white"
                >
                  <MessageCircle className="size-4 shrink-0 text-emerald-300" />
                  {site.whatsappDisplay}
                </a>
              </div>
              <p className="px-1 text-[10px] leading-relaxed text-navy-400">
                Este aviso se presenta como parte de un proyecto académico en planeación. No
                constituye asesoría legal.
              </p>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}
