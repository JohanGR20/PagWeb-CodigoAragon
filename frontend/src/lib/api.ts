export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "No pudimos conectar con el servidor. Verifica que la API esté en ejecución.",
      0,
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let message = "Ocurrió un error inesperado. Inténtalo de nuevo.";
    if (typeof data?.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data?.detail)) {
      message = data.detail
        .map((item: { msg?: string }) => item.msg)
        .filter(Boolean)
        .join(". ");
    }
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export function apiGet<T>(path: string) {
  return apiFetch<T>(path);
}

export function apiPost<T>(path: string, body: unknown) {
  return apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Ocurrió un error inesperado.";
}

// ---------------------------------------------------------------------------
// Tipos de respuesta
// ---------------------------------------------------------------------------
export interface Health {
  status: string;
  service: string;
  version: string;
  environment: string;
}

export interface SalesPoint {
  month: string;
  label: string;
  total: number;
  count: number;
}

export interface CategorySlice {
  name: string;
  value: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
  total: number;
}

export interface LowStockItem {
  product: string;
  sku: string;
  warehouse: string;
  quantity: number;
  min_stock: number;
}

export interface RecentSale {
  id: number;
  folio: string;
  client: string;
  total: number;
  status: string;
  sale_date: string;
}

export interface ActivityItem {
  id: number;
  action: string;
  description: string;
  created_at: string;
}

export interface DashboardSummary {
  generated_at: string;
  revenue_month: number;
  revenue_delta_pct: number | null;
  sales_month: number;
  sales_delta_pct: number | null;
  active_products: number;
  low_stock_count: number;
  pending_quotes: number;
  clients_count: number;
  accounts_receivable: number;
  sales_series: SalesPoint[];
  category_series: CategorySlice[];
  top_products: TopProduct[];
  low_stock: LowStockItem[];
  recent_sales: RecentSale[];
  recent_activity: ActivityItem[];
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  category_id: number;
  category_name: string;
  unit_price: number;
  cost_price: number;
  unit: string;
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Warehouse {
  id: number;
  name: string;
  location: string | null;
  is_active: boolean;
}

export type InventoryStatus = "agotado" | "bajo" | "medio" | "ok";

export interface InventoryItem {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  category_name: string;
  warehouse_id: number;
  warehouse_name: string;
  quantity: number;
  min_stock: number;
  unit_price: number;
  stock_value: number;
  status: InventoryStatus;
}

export interface Movement {
  id: number;
  product_name: string;
  warehouse_name: string;
  movement_type: "entrada" | "salida" | "ajuste";
  quantity: number;
  reference: string | null;
  notes: string | null;
  created_at: string;
}

export interface Client {
  id: number;
  name: string;
  business_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  rfc: string | null;
  notes: string | null;
  created_at: string;
}

export interface Sale {
  id: number;
  folio: string;
  client_name: string;
  sale_date: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  payment_method: string;
  items_count: number;
}

export interface Invoice {
  id: number;
  folio: string;
  client_name: string;
  sale_folio: string | null;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax: number;
  total: number;
  paid_amount: number;
  status: string;
}

export interface QuoteItem {
  id: number;
  product_id: number | null;
  description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Quote {
  id: number;
  folio: string;
  client_id: number;
  client: {
    id: number;
    name: string;
    business_name: string;
    email: string | null;
    phone: string | null;
  };
  issue_date: string;
  valid_until: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  notes: string | null;
  items: QuoteItem[];
}

export interface ContactCreated {
  id: number;
  message: string;
}

// ---------------------------------------------------------------------------
// Payloads
// ---------------------------------------------------------------------------
export interface ContactPayload {
  name: string;
  business_name?: string;
  email: string;
  phone: string;
  service_interest: string;
  budget?: string;
  message: string;
  consent: boolean;
}

export interface ClientPayload {
  name: string;
  business_name: string;
  email?: string;
  phone?: string;
  address?: string;
  rfc?: string;
  notes?: string;
}

export interface QuoteCreatePayload {
  client_id: number;
  valid_until: string;
  notes?: string;
  tax_rate: number;
  items: {
    product_id: number | null;
    description: string;
    quantity: number;
    unit_price: number;
  }[];
}

export interface MovementPayload {
  product_id: number;
  warehouse_id: number;
  movement_type: "entrada" | "salida" | "ajuste";
  quantity: number;
  notes?: string;
}

export const api = {
  health: () => apiGet<Health>("/api/health"),
  dashboard: () => apiGet<DashboardSummary>("/api/dashboard/summary"),
  products: () => apiGet<Product[]>("/api/products"),
  categories: () => apiGet<Category[]>("/api/categories"),
  warehouses: () => apiGet<Warehouse[]>("/api/warehouses"),
  inventory: () => apiGet<InventoryItem[]>("/api/inventory"),
  movements: (limit = 15) => apiGet<Movement[]>(`/api/movements?limit=${limit}`),
  clients: () => apiGet<Client[]>("/api/clients"),
  sales: () => apiGet<Sale[]>("/api/sales?limit=100"),
  invoices: () => apiGet<Invoice[]>("/api/invoices?limit=100"),
  quotes: () => apiGet<Quote[]>("/api/quotes?limit=100"),
  createContact: (payload: ContactPayload) => apiPost<ContactCreated>("/api/contact", payload),
  createClient: (payload: ClientPayload) => apiPost<Client>("/api/clients", payload),
  createQuote: (payload: QuoteCreatePayload) => apiPost<Quote>("/api/quotes", payload),
  createMovement: (payload: MovementPayload) => apiPost<Movement>("/api/inventory/movements", payload),
};
