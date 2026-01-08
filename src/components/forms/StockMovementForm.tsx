import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, StockMovement } from "@/types";

interface StockMovementFormProps {
  products: Product[];
  onSubmit: (data: Partial<StockMovement>) => void;
  onCancel: () => void;
}

export const StockMovementForm = ({ products, onSubmit, onCancel }: StockMovementFormProps) => {
  const [productId, setProductId] = useState<number | undefined>();
  const [type, setType] = useState<"Entrée" | "Sortie">("Entrée");
  const [quantity, setQuantity] = useState(1);
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    onSubmit({ productId, type, quantity, reference, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><Label>Produit</Label>
        <Select onValueChange={(v) => setProductId(parseInt(v))}>
          <SelectTrigger><SelectValue placeholder="Sélectionner un produit" /></SelectTrigger>
          <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div><Label>Type de mouvement</Label>
        <Select value={type} onValueChange={(v) => setType(v as "Entrée" | "Sortie")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="Entrée">Entrée (réception)</SelectItem><SelectItem value="Sortie">Sortie (vente/consommation)</SelectItem></SelectContent>
        </Select>
      </div>
      <div><Label>Quantité</Label><Input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} min={1} /></div>
      <div><Label>Référence</Label><Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="CMD-001, VTE-002..." /></div>
      <div><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
};
