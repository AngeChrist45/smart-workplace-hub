import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Mail, Phone, Download, Edit, Trash2, QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmployeeForm } from "@/components/forms/EmployeeForm";
import { Employee } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { exportEmployeesToPDF, exportEmployeesToExcel } from "@/utils/exports";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { QRCodeSVG } from "qrcode.react";

const initialEmployees: Employee[] = [
  { id: 1, name: "Marie Kouassi", role: "Développeur Full-Stack", status: "Actif", email: "marie.k@company.com", phone: "+225 07 00 00 01", avatar: "MK", qrCode: "EMP001" },
  { id: 2, name: "Jean Touré", role: "Chef de Projet", status: "Actif", email: "jean.t@company.com", phone: "+225 07 00 00 02", avatar: "JT", qrCode: "EMP002" },
  { id: 3, name: "Sophie Diallo", role: "Commercial Senior", status: "Actif", email: "sophie.d@company.com", phone: "+225 07 00 00 03", avatar: "SD", qrCode: "EMP003" },
  { id: 4, name: "Kofi Mensah", role: "Designer UI/UX", status: "En congé", email: "kofi.m@company.com", phone: "+225 07 00 00 04", avatar: "KM", qrCode: "EMP004" },
  { id: 5, name: "Aminata Sow", role: "Responsable RH", status: "Actif", email: "aminata.s@company.com", phone: "+225 07 00 00 05", avatar: "AS", qrCode: "EMP005" },
  { id: 6, name: "Ibrahim Keita", role: "Développeur Backend", status: "Actif", email: "ibrahim.k@company.com", phone: "+225 07 00 00 06", avatar: "IK", qrCode: "EMP006" },
];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [qrEmployee, setQrEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (data: any) => {
    if (editingEmployee) {
      setEmployees(prev => prev.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, ...data }
          : emp
      ));
      toast({ title: "Employé modifié avec succès" });
    } else {
      const newEmployee: Employee = {
        id: Math.max(...employees.map(e => e.id)) + 1,
        ...data,
        avatar: data.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
        qrCode: `EMP${String(Math.max(...employees.map(e => e.id)) + 1).padStart(3, '0')}`
      };
      setEmployees(prev => [...prev, newEmployee]);
      toast({ title: "Employé ajouté avec succès" });
    }
    setIsDialogOpen(false);
    setEditingEmployee(undefined);
  };

  const handleDelete = (id: number) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    toast({ title: "Employé supprimé" });
    setDeleteId(null);
  };
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employés</h1>
          <p className="mt-2 text-muted-foreground">
            Gérez votre équipe et leurs informations
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportEmployeesToPDF(employees)}>
                Exporter en PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportEmployeesToExcel(employees)}>
                Exporter en Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setEditingEmployee(undefined)}>
                <Plus className="h-4 w-4" />
                Ajouter un employé
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEmployee ? "Modifier l'employé" : "Nouvel employé"}
                </DialogTitle>
              </DialogHeader>
              <EmployeeForm
                employee={editingEmployee}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingEmployee(undefined);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un employé..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Employees Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    {employee.avatar}
                  </div>
                  <div>
                    <CardTitle className="text-base">{employee.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                  </div>
                </div>
                <Badge variant={employee.status === "Actif" ? "default" : "secondary"}>
                  {employee.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setQrEmployee(employee)}
                >
                  <QrCode className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditingEmployee(employee);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-destructive hover:text-destructive"
                  onClick={() => setDeleteId(employee.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* QR Code Dialog */}
      <Dialog open={!!qrEmployee} onOpenChange={() => setQrEmployee(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Code QR - {qrEmployee?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {qrEmployee && (
              <>
                <div className="bg-white p-4 rounded-lg">
                  <QRCodeSVG 
                    value={qrEmployee.qrCode || ''}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="text-center">
                  <p className="font-semibold">{qrEmployee.name}</p>
                  <p className="text-sm text-muted-foreground">{qrEmployee.qrCode}</p>
                </div>
                <Button
                  onClick={() => {
                    window.print();
                  }}
                  className="w-full"
                >
                  Imprimer le QR Code
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
