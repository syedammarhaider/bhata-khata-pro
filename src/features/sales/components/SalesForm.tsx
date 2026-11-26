// ============================================================
// FILE 169
// PATH: E:\BRICKSCS\src\features\sales\components\SalesForm.tsx
// ============================================================

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type {
  SalesCustomer,
  SalesFormData,
  SaleRecord,
  SalesItem,
} from "../sales.types";
import SalesCustomerSelect from "./SalesCustomerSelect";
import SalesItemForm from "./SalesItemForm";
import SalesItemsTable from "./SalesItemsTable";
import SalesDiscountField from "./SalesDiscountField";
import SalesNotesField from "./SalesNotesField";
import { calculateSalesSubtotal, calculateSalesGrandTotal } from "../sales.utils";

interface SalesFormProps {
  customers: SalesCustomer[];
  onSubmit: (data: SalesFormData) => void;
  onClose: () => void;
  initialSale?: SaleRecord;
}

export default function SalesForm({
  customers,
  onSubmit,
  onClose,
  initialSale,
}: SalesFormProps) {
  const [customerId, setCustomerId] = useState(initialSale?.customerId ?? 0);
  const [customerName, setCustomerName] = useState(initialSale?.customerName ?? "");
  const [customerPhone, setCustomerPhone] = useState(initialSale?.customerPhone ?? "");
  const [items, setItems] = useState<SalesItem[]>(initialSale?.items ?? []);
  const [discount, setDiscount] = useState(initialSale?.discount ?? 0);
  const [tax, setTax] = useState(initialSale?.tax ?? 0);
  const [saleDate, setSaleDate] = useState(initialSale?.saleDate ?? new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState(initialSale?.notes ?? "");
  const [error, setError] = useState("");

  const subtotal = calculateSalesSubtotal(items);
  const grandTotal = calculateSalesGrandTotal(subtotal, discount, tax);

  function addItem(item: Omit<SalesItem, "id" | "lineTotal">) {
    setItems((current) => [
      ...current,
      {
        ...item,
        id: Date.now() + current.length,
        lineTotal: item.quantity * item.unitPrice,
      },
    ]);
  }

  function removeItem(id: number) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!customerName.trim()) {
      setError("Enter or select a customer.");
      return;
    }

    if (!items.length) {
      setError("Add at least one brick item.");
      return;
    }

    if (discount < 0 || tax < 0 || discount > subtotal) {
      setError("Check the discount and tax values.");
      return;
    }

    setError("");

    onSubmit({
      customerId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || undefined,
      items,
      discount,
      tax,
      saleDate,
      notes: notes.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <form
        onSubmit={submit}
        className="my-auto w-full max-w-3xl space-y-5 rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">          {initialSale ? `Edit ${initialSale.invoiceNumber}` : "Create new sale"}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}

        <SalesCustomerSelect
          customers={customers}
          customerId={customerId}
          customerName={customerName}
          customerPhone={customerPhone}
          onCustomerChange={(customer) => {
            setCustomerId(customer.id);
            setCustomerName(customer.name);
            setCustomerPhone(customer.phone ?? "");
          }}
          onNameChange={(name) => {
            setCustomerName(name);
            if (name !== customerName) setCustomerId(0);
          }}
          onPhoneChange={(phone) => {
            setCustomerPhone(phone);
            if (phone !== customerPhone) setCustomerId(0);
          }}
        />

        <SalesItemForm onAdd={addItem} />

        <SalesItemsTable items={items} onRemove={removeItem} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SalesDiscountField
            label="Discount (PKR)"
            value={discount}
            onChange={setDiscount}
            max={subtotal > 0 ? subtotal : undefined}
          />
          <SalesDiscountField
            label="Additional tax (PKR)"
            value={tax}
            onChange={setTax}
          />
        </div>

        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>PKR {subtotal.toLocaleString("en-PK")}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span>Discount</span>
            <span>PKR {discount.toLocaleString("en-PK")}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span>Tax</span>
            <span>PKR {tax.toLocaleString("en-PK")}</span>
          </div>
          <div className="mt-3 flex justify-between border-t pt-3 text-base font-bold dark:border-slate-700">
            <span>Grand total</span>
            <span>PKR {grandTotal.toLocaleString("en-PK")}</span>
          </div>
        </div>

        <label className="block text-sm">
          Sale date
          <input
            type="date"
            required
            value={saleDate}
            onChange={(event) => setSaleDate(event.target.value)}
            className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800"
          />
        </label>

        <SalesNotesField value={notes} onChange={setNotes} />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm dark:border-slate-700">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
            {initialSale ? "Save changes" : "Create sale"}
          </button>
        </div>
      </form>
    </div>
  );
}
