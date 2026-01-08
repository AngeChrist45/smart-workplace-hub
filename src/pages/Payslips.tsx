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
import { Plus, Search, Download, Trash2, Eye, Check } from "lucide-react";
import { Payslip } from "@/types";
import { PayslipForm } from "@/components/forms/PayslipForm";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const initialPayslips: Payslip[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Amadou Diallo",
    period: "Janvier 2024",
    baseSalary: 450000,
    bonuses: 50000,
    deductions: 45000,
    netSalary: 455000,
    status: "Payé",
    paymentDate: "2024-01-31",
    createdAt: "2024-01-25",
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Fatou Sow",
    period: "Janvier 2024",
    baseSalary: 380000,
    bonuses: 30000,
    deductions: 38000,
    netSalary: 372000,
    status: "Validé",
    createdAt: "2024-01-25",
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: "Moussa Koné",
    period: "Janvier 2024",
    baseSalary: 320000,
    bonuses: 0,
    deductions: 32000,
    netSalary: 288000,
    status: "Brouillon",
    createdAt: "2024-01-25",
  },
];

const Payslips = () => {
  const [payslips, setPayslips] = useState<Payslip[]>(initialPayslips);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingPayslip, setViewingPayslip] = useState<Payslip | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredPayslips = payslips.filter((payslip) => {
    const matchesSearch = payslip.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payslip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddPayslip = (data: Partial<Payslip>) => {
    const newPayslip: Payslip = {
      id: Math.max(...payslips.map((p) => p.id)) + 1,
      employeeId: data.employeeId || 0,
      employeeName: data.employeeName || "",
      period: data.period || "",
      baseSalary: data.baseSalary || 0,
      bonuses: data.bonuses || 0,
      deductions: data.deductions || 0,
      netSalary: (data.baseSalary || 0) + (data.bonuses || 0) - (data.deductions || 0),
      status: "Brouillon",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPayslips([...payslips, newPayslip]);
    setIsDialogOpen(false);
    toast({ title: "Bulletin créé", description: "Le bulletin de paie a été créé." });
  };

  const handleValidate = (id: number) => {
    setPayslips(payslips.map((p) => (p.id === id ? { ...p, status: "Validé" as const } : p)));
    toast({ title: "Bulletin validé", description: "Le bulletin a été validé." });
  };

  const handleMarkPaid = (id: number) => {
    setPayslips(
      payslips.map((p) =>
        p.id === id
          ? { ...p, status: "Payé" as const, paymentDate: new Date().toISOString().split("T")[0] }
          : p
      )
    );
    toast({ title: "Paiement effectué", description: "Le bulletin a été marqué comme payé." });
  };

  const handleDelete = (id: number) => {
    setPayslips(payslips.filter((p) => p.id !== id));
    setDeleteId(null);
    toast({ title: "Bulletin supprimé", description: "Le bulletin a été supprimé." });
  };

  const getStatusBadge = (status: Payslip["status"]) => {
    const styles = {
      Brouillon: "bg-muted text-muted-foreground",
      Validé: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Payé: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(amount);
  };

  const exportPayslipToPDF = (payslip: Payslip) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("BULLETIN DE PAIE", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Période: ${payslip.period}`, 14, 40);
    doc.text(`Employé: ${payslip.employeeName}`, 14, 50);
    doc.text(`Date de paiement: ${payslip.paymentDate || "Non payé"}`, 14, 60);

    autoTable(doc, {
      startY: 75,
      head: [["Libellé", "Montant"]],
      body: [
        ["Salaire de base", formatCurrency(payslip.baseSalary)],
        ["Primes et bonus", formatCurrency(payslip.bonuses)],
        ["Déductions", `-${formatCurrency(payslip.deductions)}`],
      ],
      theme: "grid",
      headStyles: { fillColor: [99, 102, 241] },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Salaire Net: ${formatCurrency(payslip.netSalary)}`, 14, finalY);

    doc.save(`bulletin-${payslip.employeeName.replace(/\s+/g, "-")}-${payslip.period.replace(/\s+/g, "-")}.pdf`);
  };

  const totalNetSalaries = payslips.reduce((sum, p) => sum + p.netSalary, 0);
  const paidAmount = payslips.filter((p) => p.status === "Payé").reduce((sum, p) => sum + p.netSalary, 0);
  const pendingAmount = payslips.filter((p) => p.status !== "Payé").reduce((sum, p) => sum + p.netSalary, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bulletins de paie</h1>
          <p className="text-muted-foreground">Gérez les fiches de paie des employés</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau bulletin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Créer un bulletin de paie</DialogTitle>
            </DialogHeader>
            <PayslipForm onSubmit={handleAddPayslip} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Masse salariale</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalNetSalaries)}</p>
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
            placeholder="Rechercher un employé..."
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
          <option value="Validé">Validé</option>
          <option value="Payé">Payé</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Salaire base</TableHead>
              <TableHead>Primes</TableHead>
              <TableHead>Déductions</TableHead>
              <TableHead>Net</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayslips.map((payslip) => (
              <TableRow key={payslip.id}>
                <TableCell className="font-medium">{payslip.employeeName}</TableCell>
                <TableCell>{payslip.period}</TableCell>
                <TableCell>{formatCurrency(payslip.baseSalary)}</TableCell>
                <TableCell className="text-green-600">+{formatCurrency(payslip.bonuses)}</TableCell>
                <TableCell className="text-red-600">-{formatCurrency(payslip.deductions)}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(payslip.netSalary)}</TableCell>
                <TableCell>{getStatusBadge(payslip.status)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewingPayslip(payslip)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => exportPayslipToPDF(payslip)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    {payslip.status === "Brouillon" && (
                      <Button variant="ghost" size="icon" onClick={() => handleValidate(payslip.id)}>
                        <Check className="h-4 w-4 text-blue-600" />
                      </Button>
                    )}
                    {payslip.status === "Validé" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkPaid(payslip.id)}
                        className="text-green-600"
                      >
                        Payer
                      </Button>
                    )}
                    {payslip.status === "Brouillon" && (
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(payslip.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewingPayslip} onOpenChange={() => setViewingPayslip(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulletin de paie - {viewingPayslip?.period}</DialogTitle>
          </DialogHeader>
          {viewingPayslip && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-lg font-semibold">{viewingPayslip.employeeName}</p>
                <p className="text-sm text-muted-foreground">Période: {viewingPayslip.period}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Salaire de base</span>
                  <span>{formatCurrency(viewingPayslip.baseSalary)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Primes et bonus</span>
                  <span>+{formatCurrency(viewingPayslip.bonuses)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Déductions</span>
                  <span>-{formatCurrency(viewingPayslip.deductions)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Salaire Net</span>
                  <span>{formatCurrency(viewingPayslip.netSalary)}</span>
                </div>
              </div>
              {viewingPayslip.paymentDate && (
                <p className="text-sm text-muted-foreground">
                  Payé le: {viewingPayslip.paymentDate}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le bulletin ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le bulletin sera définitivement supprimé.
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

export default Payslips;
