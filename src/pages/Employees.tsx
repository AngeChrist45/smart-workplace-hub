import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";

const employees = [
  { id: 1, name: "Marie Kouassi", role: "Développeur Full-Stack", status: "Actif", email: "marie.k@company.com", phone: "+225 07 00 00 01", avatar: "MK" },
  { id: 2, name: "Jean Touré", role: "Chef de Projet", status: "Actif", email: "jean.t@company.com", phone: "+225 07 00 00 02", avatar: "JT" },
  { id: 3, name: "Sophie Diallo", role: "Commercial Senior", status: "Actif", email: "sophie.d@company.com", phone: "+225 07 00 00 03", avatar: "SD" },
  { id: 4, name: "Kofi Mensah", role: "Designer UI/UX", status: "En congé", email: "kofi.m@company.com", phone: "+225 07 00 00 04", avatar: "KM" },
  { id: 5, name: "Aminata Sow", role: "Responsable RH", status: "Actif", email: "aminata.s@company.com", phone: "+225 07 00 00 05", avatar: "AS" },
  { id: 6, name: "Ibrahim Keita", role: "Développeur Backend", status: "Actif", email: "ibrahim.k@company.com", phone: "+225 07 00 00 06", avatar: "IK" },
];

export default function Employees() {
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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un employé
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un employé..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employees Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((employee) => (
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
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{employee.phone}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
