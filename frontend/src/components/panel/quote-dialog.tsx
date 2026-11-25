"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FilePlus2, Loader2, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api, getErrorMessage, type Client, type Product } from "@/lib/api";
import { formatCurrency, futureDateInput } from "@/lib/utils";
import { quoteSchema, type QuoteFormValues } from "@/lib/validations";

const TAX_RATE = 0.16;

export function QuoteDialog({
  clients,
  products,
}: {
  clients: Client[];
  products: Product[];
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      client_id: "",
      valid_until: futureDateInput(15),
      notes: "",
      items: [
        {
          product_id: products[0] ? String(products[0].id) : "",
          description: products[0]?.name ?? "",
          quantity: 1,
          unit_price: products[0]?.unit_price ?? 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const subtotal = watchedItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
    0,
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const mutation = useMutation({
    mutationFn: (values: QuoteFormValues) =>
      api.createQuote({
        client_id: Number(values.client_id),
        valid_until: values.valid_until,
        notes: values.notes || undefined,
        tax_rate: TAX_RATE,
        items: values.items.map((item) => ({
          product_id: item.product_id ? Number(item.product_id) : null,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      }),
    onSuccess: (quote) => {
      toast.success(`Cotización ${quote.folio} creada y marcada como enviada.`);
      void queryClient.invalidateQueries({ queryKey: ["quotes"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      form.reset({
        client_id: "",
        valid_until: futureDateInput(15),
        notes: "",
        items: [
          {
            product_id: products[0] ? String(products[0].id) : "",
            description: products[0]?.name ?? "",
            quantity: 1,
            unit_price: products[0]?.unit_price ?? 0,
          },
        ],
      });
      setOpen(false);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const selectProduct = (index: number, productId: string) => {
    const product = products.find((item) => String(item.id) === productId);
    form.setValue(`items.${index}.product_id`, productId, { shouldValidate: true });
    if (product) {
      form.setValue(`items.${index}.description`, product.name, { shouldValidate: true });
      form.setValue(`items.${index}.unit_price`, product.unit_price, {
        shouldValidate: true,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gold" size="sm">
          <FilePlus2 className="size-3.5" />
          Nueva cotización
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nueva cotización</DialogTitle>
          <DialogDescription>
            El subtotal, IVA y total se calculan automáticamente al guardar. Se registra
            como enviada al cliente.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="space-y-5"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="quote-client">Cliente</Label>
              <Select
                value={form.watch("client_id")}
                onValueChange={(value) =>
                  form.setValue("client_id", value, { shouldValidate: true })
                }
              >
                <SelectTrigger id="quote-client" className="mt-1.5">
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={String(client.id)}>
                      {client.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.client_id && (
                <p className="mt-1.5 text-[11px] font-medium text-rose-600">
                  {form.formState.errors.client_id.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="quote-valid">Vigente hasta</Label>
              <Input
                id="quote-valid"
                type="date"
                className="mt-1.5"
                {...form.register("valid_until")}
              />
              {form.formState.errors.valid_until && (
                <p className="mt-1.5 text-[11px] font-medium text-rose-600">
                  {form.formState.errors.valid_until.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Productos o servicios</Label>
              <button
                type="button"
                onClick={() =>
                  append({
                    product_id: products[0] ? String(products[0].id) : "",
                    description: products[0]?.name ?? "",
                    quantity: 1,
                    unit_price: products[0]?.unit_price ?? 0,
                  })
                }
                className="inline-flex items-center gap-1 text-[11px] font-bold text-navy-600 transition hover:text-gold-600"
              >
                <Plus className="size-3.5" />
                Agregar partida
              </button>
            </div>

            <div className="mt-2 space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-navy-950/[0.08] bg-cream/40 p-3"
                >
                  <div className="grid gap-3 sm:grid-cols-[1fr_84px_112px_28px]">
                    <div>
                      <Select
                        value={form.watch(`items.${index}.product_id`)}
                        onValueChange={(value) => selectProduct(index, value)}
                      >
                        <SelectTrigger className="h-9 bg-white text-xs">
                          <SelectValue placeholder="Producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={String(product.id)}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        className="mt-2 h-9 bg-white text-xs"
                        placeholder="Descripción"
                        {...form.register(`items.${index}.description`)}
                      />
                      {form.formState.errors.items?.[index]?.description && (
                        <p className="mt-1 text-[10px] font-medium text-rose-600">
                          {form.formState.errors.items[index]?.description?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="number"
                        min={1}
                        className="h-9 bg-white text-xs"
                        aria-label={`Cantidad partida ${index + 1}`}
                        {...form.register(`items.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                      />
                      {form.formState.errors.items?.[index]?.quantity && (
                        <p className="mt-1 text-[10px] font-medium text-rose-600">
                          {form.formState.errors.items[index]?.quantity?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        className="h-9 bg-white text-xs"
                        aria-label={`Precio unitario partida ${index + 1}`}
                        {...form.register(`items.${index}.unit_price`, {
                          valueAsNumber: true,
                        })}
                      />
                      {form.formState.errors.items?.[index]?.unit_price && (
                        <p className="mt-1 text-[10px] font-medium text-rose-600">
                          {form.formState.errors.items[index]?.unit_price?.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => (fields.length > 1 ? remove(index) : undefined)}
                      disabled={fields.length === 1}
                      className="flex h-9 items-center justify-center rounded-lg text-navy-300 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
                      aria-label="Eliminar partida"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-right text-[10px] font-semibold text-navy-500">
                    Importe:{" "}
                    {formatCurrency(
                      (Number(watchedItems[index]?.quantity) || 0) *
                        (Number(watchedItems[index]?.unit_price) || 0),
                    )}
                  </p>
                </div>
              ))}
            </div>
            {form.formState.errors.items?.message && (
              <p className="mt-2 text-[11px] font-medium text-rose-600">
                {form.formState.errors.items.message}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-navy-950/[0.07] bg-cream/60 p-4">
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-navy-600">
                <span>Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>IVA (16%)</span>
                <span className="font-semibold">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-navy-950/10 pt-1.5 text-sm font-bold text-navy-950">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="quote-notes">Notas (opcional)</Label>
            <Textarea
              id="quote-notes"
              placeholder="Condiciones, tiempo de entrega o alcance…"
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
              Crear cotización
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
