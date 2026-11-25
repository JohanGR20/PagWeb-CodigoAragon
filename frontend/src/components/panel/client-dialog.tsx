"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, getErrorMessage } from "@/lib/api";
import { clientSchema, type ClientFormValues } from "@/lib/validations";

export function ClientDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      business_name: "",
      email: "",
      phone: "",
      address: "",
      rfc: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ClientFormValues) =>
      api.createClient({
        name: values.name,
        business_name: values.business_name,
        email: values.email || undefined,
        phone: values.phone || undefined,
        address: values.address || undefined,
        rfc: values.rfc || undefined,
        notes: values.notes || undefined,
      }),
    onSuccess: (client) => {
      toast.success(`${client.business_name} se agregó al directorio.`);
      void queryClient.invalidateQueries({ queryKey: ["clients"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      form.reset();
      setOpen(false);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gold" size="sm">
          <UserPlus className="size-3.5" />
          Nuevo cliente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo cliente</DialogTitle>
          <DialogDescription>
            Registra los datos del negocio para asociar ventas y cotizaciones.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="space-y-4"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="client-name">Contacto *</Label>
              <Input
                id="client-name"
                placeholder="Nombre de la persona"
                className="mt-1.5"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="mt-1.5 text-[11px] font-medium text-rose-600">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="client-business">Negocio *</Label>
              <Input
                id="client-business"
                placeholder="Razón comercial"
                className="mt-1.5"
                {...form.register("business_name")}
              />
              {form.formState.errors.business_name && (
                <p className="mt-1.5 text-[11px] font-medium text-rose-600">
                  {form.formState.errors.business_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="client-email">Correo</Label>
              <Input
                id="client-email"
                type="email"
                placeholder="contacto@negocio.com"
                className="mt-1.5"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="mt-1.5 text-[11px] font-medium text-rose-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="client-phone">Teléfono</Label>
              <Input
                id="client-phone"
                type="tel"
                placeholder="55 1234 5678"
                className="mt-1.5"
                {...form.register("phone")}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="client-rfc">RFC</Label>
              <Input
                id="client-rfc"
                placeholder="XAXX010101000"
                className="mt-1.5 uppercase"
                {...form.register("rfc")}
              />
            </div>
            <div>
              <Label htmlFor="client-address">Dirección</Label>
              <Input
                id="client-address"
                placeholder="Calle, número, colonia"
                className="mt-1.5"
                {...form.register("address")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="client-notes">Notas</Label>
            <Textarea
              id="client-notes"
              placeholder="Preferencias de entrega, horarios, condiciones…"
              className="mt-1.5 min-h-[80px]"
              {...form.register("notes")}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="gold" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar cliente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
