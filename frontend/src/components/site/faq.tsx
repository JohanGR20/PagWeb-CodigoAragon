"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Necesito saber de tecnología para trabajar con ustedes?",
    answer:
      "No. Nuestro trabajo es traducir tus procesos a herramientas sencillas. Te acompañamos con capacitación, lenguaje cotidiano y soporte para que tú y tu equipo puedan usar el sistema sin depender de un experto.",
  },
  {
    question: "¿Cuánto cuesta digitalizar mi negocio?",
    answer:
      "Depende del alcance. Manejamos rangos de referencia de $3,000 a $18,000 por desarrollo y de $500 a $2,000 mensuales de mantenimiento. Después de un diagnóstico breve te presentamos una cotización acotada, sin funciones que no necesitas.",
  },
  {
    question: "¿Puedo empezar con algo pequeño?",
    answer:
      "Sí. Podemos iniciar con una presencia web, un catálogo por QR o un módulo de ventas e inventario. La idea es desplegar por etapas y crecer conforme el negocio lo necesite.",
  },
  {
    question: "¿Trabajan solo en CDMX?",
    answer:
      "Nuestro foco inicial es la Ciudad de México y zonas cercanas del Estado de México. También podemos trabajar de forma remota con negocios de otras regiones; el acompañamiento y las visitas se acuerdan según el proyecto.",
  },
  {
    question: "¿Qué incluye el soporte?",
    answer:
      "Capacitación, mantenimiento, hosting y mejoras graduales dentro del alcance acordado. Cada proyecto define respaldos, niveles de servicio y tiempos de respuesta en el contrato o póliza de soporte.",
  },
  {
    question: "¿Cómo protegen la información de mi negocio?",
    answer:
      "Trabajamos con alcance contractual, protección de datos, respaldos y niveles de servicio. Antes de iniciar definimos qué información se resguarda y quién puede acceder a ella.",
  },
];

export function FaqSection() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.question} value={`item-${index}`}>
          <AccordionTrigger>
            <span className="flex items-start gap-3">
              <span className="mt-0.5 text-[11px] font-bold tracking-wider text-gold-600">
                0{index + 1}
              </span>
              {faq.question}
            </span>
          </AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
