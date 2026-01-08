import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const [name, setName] = useState(product?.name || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [category, setCategory] = useState(product?.category || "");
  const [quantity, setQuantity] = useState(product?.quantity || 0);
  const [minStock, setMinStock] = useState(product?.minStock || 5);
  const [unitPrice, setUnitPrice] = useState(product?.unitPrice || 0);
  const [costPrice, setCostPrice] = useState(product?.costPrice || 0);
  const [supplier, setSupplier] = useState(product?.supplier || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, sku, category, quantity, minStock, unitPrice, costPrice, supplier });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><Label>Nom du produit</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>SKU</Label><Input value={sku} onChange={(e) => setSku(e.target.value)} required /></div>
        <div><Label>Catégorie</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} required /></div>
        <div><Label>Quantité</Label><Input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} /></div>
        <div><Label>Stock minimum</Label><Input type="number" value={minStock} onChange={(e) => setMinStock(parseInt(e.target.value) || 0)} /></div>
        <div><Label>Prix de vente</Label><Input type="number" value={unitPrice} onChange={(e) => setUnitPrice(parseInt(e.target.value) || 0)} /></div>
        <div><Label>Prix d'achat</Label><Input type="number" value={costPrice} onChange={(e) => setCostPrice(parseInt(e.target.value) || 0)} /></div>
      </div>
      <div><Label>Fournisseur</Label><Input value={supplier} onChange={(e) => setSupplier(e.target.value)} /></div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">{product ? "Modifier" : "Ajouter"}</Button>
      </div>
    </form>
  );
};
