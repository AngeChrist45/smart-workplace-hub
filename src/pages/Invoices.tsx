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
import { Plus, Search, FileText, Download, Trash2, Eye, Send } from "lucide-react";
import { Invoice } from "@/types";
import { InvoiceForm } from "@/components/forms/InvoiceForm";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const initialInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "FAC-2024-001",
    clientId: 1,
    clientName: "TechCorp Solutions",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    items: [
      { id: 1, description: "Consultation IT", quantity: 10, unitPrice: 50000, total: 500000 },
      { id: 2, description: "Maintenance serveur", quantity: 1, unitPrice: 150000, total: 150000 },
    ],
    subtotal: 650000,
    tax: 117000,
    total: 767000,
    status: "Payée",
  },
  {
    id: 2,
    invoiceNumber: "FAC-2024-002",
    clientId: 2,
    clientName: "Digital Agency",
    date: "2024-01-20",
    dueDate: "2024-02-20",
    items: [
      { id: 1, description: "Développement web", quantity: 1, unitPrice: 2000000, total: 2000000 },
    ],
    subtotal: 2000000,
    tax: 360000,
    total: 2360000,
    status: "Envoyée",
  },
  {
    id: 3,
    invoiceNumber: "FAC-2024-003",
    clientId: 3,
    clientName: "StartUp Africa",
    date: "2024-01-25",
    dueDate: "2024-02-10",
    items: [
      { id: 1, description: "Formation équipe", quantity: 5, unitPrice: 100000, total: 500000 },
    ],
    subtotal: 500000,
    tax: 90000,
    total: 590000,
    status: "En retard",
  },
];

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddInvoice = (data: Partial<Invoice>) => {
    const newInvoice: Invoice = {
      id: Math.max(...invoices.map((i) => i.id)) + 1,
      invoiceNumber: `FAC-2024-${String(invoices.length + 1).padStart(3, "0")}`,
      clientId: data.clientId || 0,
      clientName: data.clientName || "",
      date: data.date || new Date().toISOString().split("T")[0],
      dueDate: data.dueDate || "",
      items: data.items || [],
      subtotal: data.subtotal || 0,
      tax: data.tax || 0,
      total: data.total || 0,
      status: "Brouillon",
      notes: data.notes,
    };
    setInvoices([...invoices, newInvoice]);
    setIsDialogOpen(false);
    toast({ title: "Facture créée", description: "La facture a été créée avec succès." });
  };

  const handleEditInvoice = (data: Partial<Invoice>) => {
    if (!editingInvoice) return;
    setInvoices(invoices.map((i) => (i.id === editingInvoice.id ? { ...i, ...data } : i)));
    setEditingInvoice(null);
    toast({ title: "Facture modifiée", description: "La facture a été mise à jour." });
  };

  const handleDelete = (id: number) => {
    setInvoices(invoices.filter((i) => i.id !== id));
    setDeleteId(null);
    toast({ title: "Facture supprimée", description: "La facture a été supprimée." });
  };

  const handleSendInvoice = (invoice: Invoice) => {
    setInvoices(invoices.map((i) => (i.id === invoice.id ? { ...i, status: "Envoyée" } : i)));
    toast({ title: "Facture envoyée", description: `La facture ${invoice.invoiceNumber} a été envoyée.` });
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    const styles = {
      Brouillon: "bg-muted text-muted-foreground",
      Envoyée: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Payée: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      "En retard": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      Annulée: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(amount);
  };

  const exportInvoiceToPDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("FACTURE", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`N°: ${invoice.invoiceNumber}`, 14, 35);
    doc.text(`Date: ${invoice.date}`, 14, 42);
    doc.text(`Échéance: ${invoice.dueDate}`, 14, 49);
    
    doc.text(`Client: ${invoice.clientName}`, 14, 62);
    
    autoTable(doc, {
      startY: 75,
      head: [["Description", "Quantité", "Prix unitaire", "Total"]],
      body: invoice.items.map((item) => [
        item.description,
        item.quantity.toString(),
        formatCurrency(item.unitPrice),
        formatCurrency(item.total),
      ]),
      theme: "grid",
      headStyles: { fillColor: [99, 102, 241] },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Sous-total: ${formatCurrency(invoice.subtotal)}`, 140, finalY);
    doc.text(`TVA (18%): ${formatCurrency(invoice.tax)}`, 140, finalY + 7);
    doc.setFontSize(14);
    doc.text(`Total: ${formatCurrency(invoice.total)}`, 140, finalY + 16);

    doc.save(`${invoice.invoiceNumber}.pdf`);
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices.filter(i => i.status === "Payée").reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices.filter(i => i.status === "Envoyée" || i.status === "En retard").reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Factures</h1>
          <p className="text-muted-foreground">Gérez vos factures clients</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle facture
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer une facture</DialogTitle>
            </DialogHeader>
            <InvoiceForm onSubmit={handleAddInvoice} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total facturé</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Payé</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">En attente</p>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(pendingAmount)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une facture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-lg bg-background"
        >
          <option value="all">Tous les statuts</option>
          <option value="Brouillon">Brouillon</option>
          <option value="Envoyée">Envoyée</option>
          <option value="Payée">Payée</option>
          <option value="En retard">En retard</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Facture</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(invoice.total)}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewingInvoice(invoice)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => exportInvoiceToPDF(invoice)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    {invoice.status === "Brouillon" && (
                      <Button variant="ghost" size="icon" onClick={() => handleSendInvoice(invoice)}>
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(invoice.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Invoice Dialog */}
      <Dialog open={!!viewingInvoice} onOpenChange={() => setViewingInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Facture {viewingInvoice?.invoiceNumber}</DialogTitle>
          </DialogHeader>
          {viewingInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{viewingInvoice.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  {getStatusBadge(viewingInvoice.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{viewingInvoice.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Échéance</p>
                  <p className="font-medium">{viewingInvoice.dueDate}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Qté</TableHead>
                      <TableHead>Prix unit.</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingInvoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell>{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="border-t pt-4 space-y-2 text-right">
                <p>Sous-total: {formatCurrency(viewingInvoice.subtotal)}</p>
                <p>TVA (18%): {formatCurrency(viewingInvoice.tax)}</p>
                <p className="text-xl font-bold">Total: {formatCurrency(viewingInvoice.total)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingInvoice} onOpenChange={() => setEditingInvoice(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la facture</DialogTitle>
          </DialogHeader>
          {editingInvoice && (
            <InvoiceForm
              invoice={editingInvoice}
              onSubmit={handleEditInvoice}
              onCancel={() => setEditingInvoice(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la facture ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La facture sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Invoices;
