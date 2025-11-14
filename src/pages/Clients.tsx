import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Mail, Phone, Building } from "lucide-react";
import { Input } from "@/components/ui/input";

const clients = [
  { 
    id: 1, 
    name: "Acme Corporation", 
    contact: "Alice Johnson", 
    status: "Actif", 
    email: "alice@acme.com", 
    phone: "+225 07 10 20 30",
    lastContact: "2025-11-10",
    value: "125,000 FCFA"
  },
  { 
    id: 2, 
    name: "TechStart Solutions", 
    contact: "Bob Martin", 
    status: "Lead", 
    email: "bob@techstart.com", 
    phone: "+225 07 11 22 33",
    lastContact: "2025-11-12",
    value: "85,000 FCFA"
  },
  { 
    id: 3, 
    name: "Global Ventures", 
    contact: "Carol White", 
    status: "Actif", 
    email: "carol@globalv.com", 
    phone: "+225 07 12 23 34",
    lastContact: "2025-11-13",
    value: "200,000 FCFA"
  },
  { 
    id: 4, 
    name: "Digital Dreams", 
    contact: "David Lee", 
    status: "Perdu", 
    email: "david@digitald.com", 
    phone: "+225 07 13 24 35",
    lastContact: "2025-10-20",
    value: "45,000 FCFA"
  },
  { 
    id: 5, 
    name: "Innovation Hub", 
    contact: "Emma Brown", 
    status: "Lead", 
    email: "emma@innohub.com", 
    phone: "+225 07 14 25 36",
    lastContact: "2025-11-14",
    value: "150,000 FCFA"
  },
  { 
    id: 6, 
    name: "SmartBiz Ltd", 
    contact: "Frank Wilson", 
    status: "Actif", 
    email: "frank@smartbiz.com", 
    phone: "+225 07 15 26 37",
    lastContact: "2025-11-11",
    value: "95,000 FCFA"
  },
];

export default function Clients() {
  const statusColors = {
    Actif: "default",
    Lead: "secondary",
    Perdu: "destructive",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">CRM - Clients</h1>
          <p className="mt-2 text-muted-foreground">
            Gérez vos relations clients et prospects
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau client
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{clients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clients Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">
              {clients.filter(c => c.status === "Actif").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">
              {clients.filter(c => c.status === "Lead").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valeur Totale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent">700K FCFA</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un client..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card key={client.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{client.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{client.contact}</p>
                  </div>
                </div>
                <Badge variant={statusColors[client.status as keyof typeof statusColors] as any}>
                  {client.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{client.phone}</span>
              </div>
              <div className="pt-2 border-t flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Valeur</span>
                <span className="font-semibold text-foreground">{client.value}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Dernier contact</span>
                <span className="font-medium text-foreground">{client.lastContact}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
