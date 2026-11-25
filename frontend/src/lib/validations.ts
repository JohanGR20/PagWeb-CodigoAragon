import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Escribe tu nombre.")
    .max(120, "El nombre es demasiado largo."),
  business_name: z
    .string()
    .trim()
    .max(160, "El nombre del negocio es demasiado largo.")
    .optional(),
  email: z.string().trim().email("Escribe un correo electrónico válido."),
  phone: z
    .string()
    .trim()
    .min(10, "Escribe un teléfono de al menos 10 dígitos.")
    .max(20, "El teléfono es demasiado largo.")
    .regex(/^[0-9+()\-\s]+$/, "Usa solo números, espacios, paréntesis o guiones."),
  service_interest: z.string().min(1, "Selecciona el servicio que te interesa."),
  budget: z.string().optional(),
  message: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más sobre tu negocio (mínimo 10 caracteres).")
    .max(2000, "El mensaje no puede exceder 2000 caracteres."),
  consent: z.boolean().refine((value) => value, {
    message: "Debes aceptar el aviso de privacidad.",
  }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const clientSchema = z.object({
  name: z.string().trim().min(2, "Escribe el nombre de contacto."),
  business_name: z.string().trim().min(2, "Escribe el nombre del negocio."),
  email: z
    .string()
    .trim()
    .email("Escribe un correo válido.")
    .optional()
    .or(z.literal("")),
  phone: z.string().trim().max(30, "El teléfono es demasiado largo.").optional(),
  address: z.string().trim().max(255, "La dirección es demasiado larga.").optional(),
  rfc: z.string().trim().max(20, "El RFC es demasiado largo.").optional(),
  notes: z.string().trim().max(1000, "Las notas son demasiado largas.").optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

export const quoteItemSchema = z.object({
  product_id: z.string().min(1, "Selecciona un producto."),
  description: z.string().trim().min(2, "Escribe una descripción."),
  quantity: z.number().int("Usa una cantidad entera.").min(1, "Mínimo 1 pieza."),
  unit_price: z.number().min(0, "El precio no puede ser negativo."),
});

export const quoteSchema = z.object({
  client_id: z.string().min(1, "Selecciona un cliente."),
  valid_until: z.string().min(1, "Selecciona la vigencia."),
  notes: z.string().trim().max(1000, "Las notas son demasiado largas.").optional(),
  items: z.array(quoteItemSchema).min(1, "Agrega al menos un producto."),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;

export const movementSchema = z.object({
  product_id: z.string().min(1, "Selecciona un producto."),
  warehouse_id: z.string().min(1, "Selecciona un almacén."),
  movement_type: z.enum(["entrada", "salida", "ajuste"]),
  quantity: z.number().int("Usa una cantidad entera.").min(1, "Mínimo 1 unidad."),
  notes: z.string().trim().max(500, "Las notas son demasiado largas.").optional(),
});

export type MovementFormValues = z.infer<typeof movementSchema>;
