import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Mail, Phone, Building, Download, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ClientForm } from "@/components/forms/ClientForm";
import { Client } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { exportClientsToPDF, exportClientsToExcel } from "@/utils/exports";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExcelImport } from "@/components/ExcelImport";

const clientColumns = [
  { key: "name", label: "Nom", required: true },
  { key: "contact", label: "Contact", required: true },
  { key: "email", label: "Email", required: true },
  { key: "phone", label: "Téléphone", required: true },
  { key: "status", label: "Statut", required: false },
  { key: "value", label: "Valeur", required: false },
  { key: "company", label: "Entreprise", required: false },
];

const initialClients: Client[] = [
  { id: 1, name: "Acme Corporation", contact: "Alice Johnson", status: "Actif", email: "alice@acme.com", phone: "+225 07 10 20 30", lastContact: "2025-11-10", value: "125,000 FCFA", company: "Acme Corp" },
  { id: 2, name: "TechStart Solutions", contact: "Bob Martin", status: "Lead", email: "bob@techstart.com", phone: "+225 07 11 22 33", lastContact: "2025-11-12", value: "85,000 FCFA", company: "TechStart" },
  { id: 3, name: "Global Ventures", contact: "Carol White", status: "Actif", email: "carol@globalv.com", phone: "+225 07 12 23 34", lastContact: "2025-11-13", value: "200,000 FCFA", company: "Global Ventures" },
  { id: 4, name: "Digital Dreams", contact: "David Lee", status: "Perdu", email: "david@digitald.com", phone: "+225 07 13 24 35", lastContact: "2025-10-20", value: "45,000 FCFA", company: "Digital Dreams" },
  { id: 5, name: "Innovation Hub", contact: "Emma Brown", status: "Lead", email: "emma@innohub.com", phone: "+225 07 14 25 36", lastContact: "2025-11-14", value: "150,000 FCFA", company: "Innovation Hub" },
  { id: 6, name: "SmartBiz Ltd", contact: "Frank Wilson", status: "Actif", email: "frank@smartbiz.com", phone: "+225 07 15 26 37", lastContact: "2025-11-11", value: "95,000 FCFA", company: "SmartBiz" },
];

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const statusColors = { Actif: "default", Lead: "secondary", Perdu: "destructive" };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (data: any) => {
    if (editingClient) {
      setClients(prev => prev.map(client => client.id === editingClient.id ? { ...client, ...data, lastContact: new Date().toISOString().split('T')[0] } : client));
      toast({ title: "Client modifié avec succès" });
    } else {
      const newClient: Client = { id: Math.max(...clients.map(c => c.id)) + 1, ...data, lastContact: new Date().toISOString().split('T')[0] };
      setClients(prev => [...prev, newClient]);
      toast({ title: "Client ajouté avec succès" });
    }
    setIsDialogOpen(false);
    setEditingClient(undefined);
  };

  const handleDelete = (id: number) => {
    setClients(prev => prev.filter(client => client.id !== id));
    toast({ title: "Client supprimé" });
    setDeleteId(null);
  };

  const handleImportClients = (importedData: Client[]) => {
    const maxId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) : 0;
    const newClients = importedData.map((client, index) => ({
      ...client,
      id: maxId + index + 1,
    }));
    setClients(prev => [...prev, ...newClients]);
    toast({ title: `${newClients.length} clients importés avec succès` });
  };

  const parseClientRow = (row: Record<string, any>): Client | null => {
    const name = row["nom"] || row["name"];
    const contact = row["contact"];
    const email = row["email"];
    
    if (!name || !email) return null;
    
    return {
      id: 0,
      name: String(name),
      contact: String(contact || name),
      email: String(email),
      phone: String(row["téléphone"] || row["telephone"] || row["phone"] || ""),
      status: (row["statut"] || row["status"] || "Lead") as Client["status"],
      lastContact: new Date().toISOString().split('T')[0],
      value: String(row["valeur"] || row["value"] || "0 FCFA"),
      company: row["entreprise"] || row["company"],
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">CRM - Clients</h1>
          <p className="mt-2 text-muted-foreground">Gérez vos relations clients et prospects</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exporter</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportClientsToPDF(clients)}>Exporter en PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportClientsToExcel(clients)}>Exporter en Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ExcelImport<Client>
            onImport={handleImportClients}
            expectedColumns={clientColumns}
            templateName="clients"
            parseRow={parseClientRow}
            buttonLabel="Importer"
          />
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setEditingClient(undefined)}><Plus className="h-4 w-4" />Nouveau client</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editingClient ? "Modifier le client" : "Nouveau client"}</DialogTitle></DialogHeader>
              <ClientForm client={editingClient} onSubmit={handleSubmit} onCancel={() => { setIsDialogOpen(false); setEditingClient(undefined); }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-primary">{clients.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Clients Actifs</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">{clients.filter(c => c.status === "Actif").length}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Leads</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-warning">{clients.filter(c => c.status === "Lead").length}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Valeur Totale</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-primary">{clients.reduce((sum, c) => sum + (parseInt(c.value.replace(/[^0-9]/g, '')) || 0), 0).toLocaleString()} FCFA</p></CardContent></Card>
      </div>

      <Card><CardContent className="pt-6"><div className="flex flex-col sm:flex-row gap-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Rechercher un client..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div><Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto"><TabsList><TabsTrigger value="all">Tous</TabsTrigger><TabsTrigger value="Actif">Actifs</TabsTrigger><TabsTrigger value="Lead">Leads</TabsTrigger><TabsTrigger value="Perdu">Perdus</TabsTrigger></TabsList></Tabs></div></CardContent></Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card key={client.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Building className="h-6 w-6" /></div>
                  <div><CardTitle className="text-base">{client.name}</CardTitle><p className="text-sm text-muted-foreground">{client.contact}</p></div>
                </div>
                <Badge variant={statusColors[client.status as keyof typeof statusColors] as any}>{client.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" /><span className="truncate">{client.email}</span></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" /><span>{client.phone}</span></div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Dernier contact:</span><span className="font-medium">{client.lastContact}</span></div>
                <div className="flex items-center justify-between text-sm mt-1"><span className="text-muted-foreground">Valeur:</span><span className="font-medium text-primary">{client.value}</span></div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditingClient(client); setIsDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" className="flex-1 text-destructive hover:text-destructive" onClick={() => setDeleteId(client.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">Aucun client trouvé</p></CardContent></Card>}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Confirmer la suppression</AlertDialogTitle><AlertDialogDescription>Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
