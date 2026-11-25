"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Lock, MessageCircle, Send } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api, getErrorMessage } from "@/lib/api";
import { budgetOptions, serviceOptions, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { contactSchema, type ContactFormValues } from "@/lib/validations";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[11px] font-medium text-rose-600">{message}</p>;
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      business_name: "",
      email: "",
      phone: "",
      service_interest: "Diagnóstico general",
      budget: "Por definir",
      message: "",
      consent: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ContactFormValues) =>
      api.createContact({
        name: values.name,
        business_name: values.business_name || undefined,
        email: values.email,
        phone: values.phone,
        service_interest: values.service_interest,
        budget: values.budget || undefined,
        message: values.message,
        consent: values.consent,
      }),
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Mensaje enviado. Te contactaremos muy pronto.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const onSubmit = (values: ContactFormValues) => mutation.mutate(values);

  const startOver = () => {
    form.reset();
    mutation.reset();
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="flex h-full flex-col justify-center rounded-3xl border border-white/10 bg-white p-8 shadow-2xl sm:p-10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-8" />
        </div>
        <h3 className="mt-6 text-center font-display text-3xl text-navy-950">
          Mensaje recibido
        </h3>
        <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
          {mutation.data?.message ??
            "Recibimos tu mensaje. Te contactaremos en menos de 24 horas hábiles."}
        </p>
        <div className="mt-7 rounded-2xl border border-navy-950/[0.07] bg-cream/70 p-4 text-sm text-navy-800">
          <p className="font-semibold">¿Prefieres algo más inmediato?</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Escríbenos por WhatsApp y con gusto revisamos tu caso.
          </p>
          <Button asChild variant="whatsapp" size="sm" className="mt-3 w-full">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" />
              Abrir WhatsApp
            </a>
          </Button>
        </div>
        <button
          type="button"
          onClick={startOver}
          className="mt-6 text-center text-xs font-semibold text-navy-500 underline-offset-4 hover:underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">
          Diagnóstico inicial
        </p>
        <h3 className="mt-2 font-display text-2xl text-navy-950 sm:text-[28px]">
          Cuéntanos de tu negocio
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Sin costo y sin compromiso. Respondemos en menos de 24 horas hábiles.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              placeholder="Tu nombre"
              autoComplete="name"
              className="mt-1.5"
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register("name")}
            />
            <FieldError message={form.formState.errors.name?.message} />
          </div>
          <div>
            <Label htmlFor="business_name">Negocio</Label>
            <Input
              id="business_name"
              placeholder="Nombre de tu negocio"
              autoComplete="organization"
              className="mt-1.5"
              {...form.register("business_name")}
            />
            <FieldError message={form.formState.errors.business_name?.message} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="email">Correo *</Label>
            <Input
              id="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
              className="mt-1.5"
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register("email")}
            />
            <FieldError message={form.formState.errors.email?.message} />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="55 1234 5678"
              autoComplete="tel"
              className="mt-1.5"
              aria-invalid={Boolean(form.formState.errors.phone)}
              {...form.register("phone")}
            />
            <FieldError message={form.formState.errors.phone?.message} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="service_interest">¿Qué te interesa? *</Label>
            <Controller
              control={form.control}
              name="service_interest"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="service_interest" className="mt-1.5" aria-invalid={Boolean(form.formState.errors.service_interest)}>
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={form.formState.errors.service_interest?.message} />
          </div>
          <div>
            <Label htmlFor="budget">Presupuesto estimado</Label>
            <Controller
              control={form.control}
              name="budget"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="budget" className="mt-1.5">
                    <SelectValue placeholder="Por definir" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="message">¿Qué quieres mejorar? *</Label>
          <Textarea
            id="message"
            placeholder="Ej. Llevo mis ventas en cuaderno y quiero controlar inventario, pedidos y clientes."
            className="mt-1.5"
            aria-invalid={Boolean(form.formState.errors.message)}
            {...form.register("message")}
          />
          <FieldError message={form.formState.errors.message?.message} />
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-cream/70 p-3.5">
          <input
            id="consent"
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 rounded border-navy-300 accent-gold-500"
            {...form.register("consent")}
          />
          <div>
            <label htmlFor="consent" className="text-[11px] leading-relaxed text-navy-700">
              Acepto que Código Aragón use mis datos para contactarme sobre esta solicitud.
              Consulta el{" "}
              <Link href="/privacidad" className="font-semibold text-navy-950 underline underline-offset-2">
                aviso de privacidad
              </Link>
              .
            </label>
            <FieldError message={form.formState.errors.consent?.message} />
          </div>
        </div>

        {mutation.isError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
            {getErrorMessage(mutation.error)}
          </div>
        )}

        <Button
          type="submit"
          variant="gold"
          size="lg"
          className={cn("w-full", mutation.isPending && "cursor-wait")}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Solicitar diagnóstico
            </>
          )}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <Lock className="size-3" />
          Tus datos se usan únicamente para dar seguimiento a tu solicitud.
        </p>
      </form>
    </div>
  );
}
