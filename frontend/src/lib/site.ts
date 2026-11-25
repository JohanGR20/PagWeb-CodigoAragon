export const site = {
  name: "Código Aragón",
  tagline: "Tecnología que se adapta a tu negocio.",
  email: "codigoaragon845@gmail.com",
  phone: "5615431206",
  phoneDisplay: "56 1543 1206",
  phoneLink: "tel:+525615431206",
  whatsappNumber: "5215615431206",
  whatsappDisplay: "56 1543 1206",
  location: "CDMX y zona metropolitana",
  hours: "Lun – Vie · 9:00 a 18:00",
  university: "FES Aragón, UNAM",
  description:
    "Desarrollo de software, automatización y acompañamiento digital para microempresas y negocios locales de la CDMX.",
};

export function whatsappLink(
  message = "Hola Código Aragón, me gustaría recibir información sobre sus servicios.",
) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { label: "Soluciones", href: "/#soluciones" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Proceso", href: "/#proceso" },
  { label: "Planes", href: "/#planes" },
  { label: "Contacto", href: "/#contacto" },
];

export const serviceOptions = [
  "Presencia web",
  "Automatización de ventas",
  "Software a medida + IA",
  "Diagnóstico general",
];

export const budgetOptions = [
  "Menos de $5,000",
  "$5,000 – $15,000",
  "$15,000 – $30,000",
  "Más de $30,000",
  "Por definir",
];
