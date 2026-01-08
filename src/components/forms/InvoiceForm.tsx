import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Invoice, InvoiceItem } from "@/types";
import { Plus, Trash2 } from "lucide-react";

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit: (data: Partial<Invoice>) => void;
  onCancel: () => void;
}

export const InvoiceForm = ({ invoice, onSubmit, onCancel }: InvoiceFormProps) => {
  const [clientName, setClientName] = useState(invoice?.clientName || "");
  const [date, setDate] = useState(invoice?.date || new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(invoice?.dueDate || "");
  const [items, setItems] = useState<InvoiceItem[]>(invoice?.items || [{ id: 1, description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  const [notes, setNotes] = useState(invoice?.notes || "");

  const addItem = () => {
    setItems([...items, { id: items.length + 1, description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      updated[index].total = updated[index].quantity * updated[index].unitPrice;
    }
    setItems(updated);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ clientName, clientId: 1, date, dueDate, items, subtotal, tax, total, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Label>Client</Label><Input value={clientName} onChange={(e) => setClientName(e.target.value)} required /></div>
        <div><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
        <div><Label>Échéance</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required /></div>
      </div>
      <div className="space-y-2">
        <Label>Lignes de facture</Label>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-end">
            <Input placeholder="Description" value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} className="flex-1" />
            <Input type="number" placeholder="Qté" value={item.quantity} onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)} className="w-20" />
            <Input type="number" placeholder="Prix" value={item.unitPrice} onChange={(e) => updateItem(index, "unitPrice", parseInt(e.target.value) || 0)} className="w-28" />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="h-4 w-4 mr-1" />Ajouter ligne</Button>
      </div>
      <div className="text-right space-y-1">
        <p>Sous-total: {subtotal.toLocaleString()} XOF</p>
        <p>TVA (18%): {tax.toLocaleString()} XOF</p>
        <p className="font-bold text-lg">Total: {total.toLocaleString()} XOF</p>
      </div>
      <div><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
};
