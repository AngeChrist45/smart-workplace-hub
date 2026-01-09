import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Trash2, ArrowDown, ArrowUp, Package } from "lucide-react";
import { Product, StockMovement } from "@/types";
import { ProductForm } from "@/components/forms/ProductForm";
import { StockMovementForm } from "@/components/forms/StockMovementForm";
import { useToast } from "@/hooks/use-toast";
import { ExcelImport } from "@/components/ExcelImport";

const productColumns = [
  { key: "name", label: "Nom", required: true },
  { key: "sku", label: "SKU", required: true },
  { key: "category", label: "Catégorie", required: true },
  { key: "quantity", label: "Quantité", required: true },
  { key: "minStock", label: "Stock Minimum", required: false },
  { key: "unitPrice", label: "Prix Vente", required: true },
  { key: "costPrice", label: "Prix Achat", required: false },
  { key: "supplier", label: "Fournisseur", required: false },
];

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Ordinateur portable HP",
    sku: "HP-LAP-001",
    category: "Informatique",
    quantity: 15,
    minStock: 5,
    unitPrice: 450000,
    costPrice: 380000,
    supplier: "TechDistrib",
    status: "En stock",
  },
  {
    id: 2,
    name: "Imprimante Canon",
    sku: "CAN-PRT-001",
    category: "Informatique",
    quantity: 3,
    minStock: 5,
    unitPrice: 125000,
    costPrice: 95000,
    supplier: "BureauPlus",
    status: "Stock faible",
  },
  {
    id: 3,
    name: "Chaise de bureau",
    sku: "CHAIR-001",
    category: "Mobilier",
    quantity: 0,
    minStock: 10,
    unitPrice: 75000,
    costPrice: 55000,
    supplier: "MobiPro",
    status: "Rupture",
  },
  {
    id: 4,
    name: "Écran 24 pouces",
    sku: "SCR-24-001",
    category: "Informatique",
    quantity: 25,
    minStock: 10,
    unitPrice: 180000,
    costPrice: 140000,
    supplier: "TechDistrib",
    status: "En stock",
  },
];

const initialMovements: StockMovement[] = [
  {
    id: 1,
    productId: 1,
    productName: "Ordinateur portable HP",
    type: "Entrée",
    quantity: 10,
    date: "2024-01-15",
    reference: "CMD-001",
    notes: "Réception commande fournisseur",
  },
  {
    id: 2,
    productId: 1,
    productName: "Ordinateur portable HP",
    type: "Sortie",
    quantity: 2,
    date: "2024-01-20",
    reference: "VTE-001",
    notes: "Vente client TechCorp",
  },
  {
    id: 3,
    productId: 2,
    productName: "Imprimante Canon",
    type: "Sortie",
    quantity: 5,
    date: "2024-01-22",
    reference: "VTE-002",
  },
];

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [movements, setMovements] = useState<StockMovement[]>(initialMovements);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const updateProductStatus = (product: Product): Product["status"] => {
    if (product.quantity === 0) return "Rupture";
    if (product.quantity < product.minStock) return "Stock faible";
    return "En stock";
  };

  const handleAddProduct = (data: Partial<Product>) => {
    const newProduct: Product = {
      id: Math.max(...products.map((p) => p.id)) + 1,
      name: data.name || "",
      sku: data.sku || "",
      category: data.category || "",
      quantity: data.quantity || 0,
      minStock: data.minStock || 5,
      unitPrice: data.unitPrice || 0,
      costPrice: data.costPrice || 0,
      supplier: data.supplier,
      status: "En stock",
    };
    newProduct.status = updateProductStatus(newProduct);
    setProducts([...products, newProduct]);
    setIsProductDialogOpen(false);
    toast({ title: "Produit ajouté", description: "Le produit a été ajouté au stock." });
  };

  const handleEditProduct = (data: Partial<Product>) => {
    if (!editingProduct) return;
    const updatedProduct = { ...editingProduct, ...data };
    updatedProduct.status = updateProductStatus(updatedProduct);
    setProducts(products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)));
    setEditingProduct(null);
    toast({ title: "Produit modifié", description: "Le produit a été mis à jour." });
  };

  const handleAddMovement = (data: Partial<StockMovement>) => {
    const product = products.find((p) => p.id === data.productId);
    if (!product) return;

    const newMovement: StockMovement = {
      id: Math.max(...movements.map((m) => m.id), 0) + 1,
      productId: data.productId!,
      productName: product.name,
      type: data.type!,
      quantity: data.quantity!,
      date: new Date().toISOString().split("T")[0],
      reference: data.reference,
      notes: data.notes,
    };

    setMovements([newMovement, ...movements]);

    // Update product quantity
    const quantityChange = data.type === "Entrée" ? data.quantity! : -data.quantity!;
    const updatedProduct = { ...product, quantity: Math.max(0, product.quantity + quantityChange) };
    updatedProduct.status = updateProductStatus(updatedProduct);
    setProducts(products.map((p) => (p.id === product.id ? updatedProduct : p)));

    setIsMovementDialogOpen(false);
    toast({ title: "Mouvement enregistré", description: `${data.type} de ${data.quantity} unités.` });
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    setDeleteId(null);
    toast({ title: "Produit supprimé", description: "Le produit a été supprimé du stock." });
  };

  const handleImportProducts = (importedData: Product[]) => {
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
    const newProducts = importedData.map((product, index) => {
      const p = {
        ...product,
        id: maxId + index + 1,
      };
      p.status = updateProductStatus(p);
      return p;
    });
    setProducts(prev => [...prev, ...newProducts]);
    toast({ title: `${newProducts.length} produits importés avec succès` });
  };

  const parseProductRow = (row: Record<string, any>): Product | null => {
    const name = row["nom"] || row["name"];
    const sku = row["sku"] || row["référence"];
    
    if (!name || !sku) return null;
    
    return {
      id: 0,
      name: String(name),
      sku: String(sku),
      category: String(row["catégorie"] || row["category"] || "Non défini"),
      quantity: Number(row["quantité"] || row["quantity"] || 0),
      minStock: Number(row["stock minimum"] || row["minstock"] || row["min stock"] || 5),
      unitPrice: Number(row["prix vente"] || row["unitprice"] || row["prix"] || 0),
      costPrice: Number(row["prix achat"] || row["costprice"] || row["coût"] || 0),
      supplier: row["fournisseur"] || row["supplier"],
      status: "En stock",
    };
  };

  const getStatusBadge = (status: Product["status"]) => {
    const styles = {
      "En stock": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      "Stock faible": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      Rupture: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(amount);
  };

  const totalValue = products.reduce((sum, p) => sum + p.quantity * p.costPrice, 0);
  const lowStockCount = products.filter((p) => p.status === "Stock faible").length;
  const outOfStockCount = products.filter((p) => p.status === "Rupture").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion de Stock</h1>
          <p className="text-muted-foreground">Gérez votre inventaire et mouvements de stock</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <ExcelImport<Product>
            onImport={handleImportProducts}
            expectedColumns={productColumns}
            templateName="produits"
            parseRow={parseProductRow}
            buttonLabel="Importer"
          />
          
          <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowDown className="mr-2 h-4 w-4" />
                Mouvement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enregistrer un mouvement</DialogTitle>
              </DialogHeader>
              <StockMovementForm
                products={products}
                onSubmit={handleAddMovement}
                onCancel={() => setIsMovementDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau produit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un produit</DialogTitle>
              </DialogHeader>
              <ProductForm onSubmit={handleAddProduct} onCancel={() => setIsProductDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total produits</p>
              <p className="text-2xl font-bold text-foreground">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Valeur du stock</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Stock faible</p>
          <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Rupture</p>
          <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
        </div>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="movements">Mouvements</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-lg bg-background"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Products Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix vente</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <span className={product.quantity < product.minStock ? "text-orange-600 font-semibold" : ""}>
                        {product.quantity}
                      </span>
                      <span className="text-muted-foreground text-sm"> / min: {product.minStock}</span>
                    </TableCell>
                    <TableCell>{formatCurrency(product.unitPrice)}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(product.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>{movement.date}</TableCell>
                    <TableCell className="font-medium">{movement.productName}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          movement.type === "Entrée"
                            ? "bg-green-100 text-green-700"
                            : movement.type === "Sortie"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      >
                        {movement.type === "Entrée" && <ArrowDown className="h-3 w-3 mr-1" />}
                        {movement.type === "Sortie" && <ArrowUp className="h-3 w-3 mr-1" />}
                        {movement.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {movement.type === "Entrée" ? "+" : "-"}
                      {movement.quantity}
                    </TableCell>
                    <TableCell>{movement.reference || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{movement.notes || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={handleEditProduct}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Inventory;
