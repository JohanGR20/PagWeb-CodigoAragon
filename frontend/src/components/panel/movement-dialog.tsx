"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowDownToLine, ArrowUpFromLine, Loader2, Scale } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api, getErrorMessage, type Product, type Warehouse } from "@/lib/api";
import { cn } from "@/lib/utils";
import { movementSchema, type MovementFormValues } from "@/lib/validations";

const movementTypes = [
  { value: "entrada", label: "Entrada", icon: ArrowDownToLine },
  { value: "salida", label: "Salida", icon: ArrowUpFromLine },
  { value: "ajuste", label: "Ajuste", icon: Scale },
] as const;

export function MovementDialog({
  products,
  warehouses,
}: {
  products: Product[];
  warehouses: Warehouse[];
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      product_id: "",
      warehouse_id: warehouses[0] ? String(warehouses[0].id) : "",
      movement_type: "entrada",
      quantity: 1,
      notes: "",
    },
  });

  const movementType = form.watch("movement_type");

  const mutation = useMutation({
    mutationFn: (values: MovementFormValues) =>
      api.createMovement({
        product_id: Number(values.product_id),
        warehouse_id: Number(values.warehouse_id),
        movement_type: values.movement_type,
        quantity: values.quantity,
        notes: values.notes || undefined,
      }),
    onSuccess: (movement) => {
      toast.success(
        `Movimiento registrado: ${movement.movement_type} de ${movement.quantity} · ${movement.product_name}`,
      );
      void queryClient.invalidateQueries({ queryKey: ["inventory"] });
      void queryClient.invalidateQueries({ queryKey: ["movements"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      form.reset({
        product_id: "",
        warehouse_id: warehouses[0] ? String(warehouses[0].id) : "",
        movement_type: "entrada",
        quantity: 1,
        notes: "",
      });
      setOpen(false);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gold" size="sm">
          <ArrowDownToLine className="size-3.5" />
          Registrar movimiento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo movimiento de inventario</DialogTitle>
          <DialogDescription>
            Las entradas suman existencias, las salidas las descuentan y el ajuste fija el
            conteo físico.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="space-y-4"
          noValidate
        >
          <div>
            <Label htmlFor="movement-product">Producto</Label>
            <Select
              value={form.watch("product_id")}
              onValueChange={(value) =>
                form.setValue("product_id", value, { shouldValidate: true })
              }
            >
              <SelectTrigger id="movement-product" className="mt-1.5">
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={String(product.id)}>
                    {product.name} · {product.sku}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.product_id && (
              <p className="mt-1.5 text-[11px] font-medium text-rose-600">
                {form.formState.errors.product_id.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="movement-warehouse">Almacén</Label>
              <Select
                value={form.watch("warehouse_id")}
                onValueChange={(value) =>
                  form.setValue("warehouse_id", value, { shouldValidate: true })
                }
              >
                <SelectTrigger id="movement-warehouse" className="mt-1.5">
                  <SelectValue placeholder="Selecciona un almacén" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.warehouse_id && (
                <p className="mt-1.5 text-[11px] font-medium text-rose-600">
                  {form.formState.errors.warehouse_id.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="movement-quantity">Cantidad</Label>
              <Input
                id="movement-quantity"
                type="number"
                min={1}
                className="mt-1.5"
                {...form.register("quantity", { valueAsNumber: true })}
              />
              {form.formState.errors.quantity && (
                <p className="mt-1.5 text-[11px] font-medium text-rose-600">
                  {form.formState.errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Tipo de movimiento</Label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {movementTypes.map((type) => {
                const Icon = type.icon;
                const active = movementType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      form.setValue("movement_type", type.value, { shouldValidate: true })
                    }
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[11px] font-semibold transition",
                      active
                        ? "border-gold-400 bg-gold-200/40 text-navy-950"
                        : "border-border bg-white text-navy-500 hover:border-navy-950/20",
                    )}
                  >
                    <Icon className="size-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
              {movementType === "ajuste"
                ? "El ajuste reemplaza la existencia actual por la cantidad capturada."
                : movementType === "salida"
                  ? "La salida descuenta unidades; no puede superar el stock disponible."
                  : "La entrada suma unidades al almacén seleccionado."}
            </p>
          </div>

          <div>
            <Label htmlFor="movement-notes">Notas (opcional)</Label>
            <Textarea
              id="movement-notes"
              placeholder="Ej. Compra a proveedor, merma, conteo físico…"
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
              Guardar movimiento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
