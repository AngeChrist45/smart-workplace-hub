import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Bell, Shield, Palette, Globe, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

  // Company settings
  const [companyName, setCompanyName] = useState("SmartWork SARL");
  const [companyEmail, setCompanyEmail] = useState("contact@smartwork.com");
  const [companyPhone, setCompanyPhone] = useState("+221 33 123 4567");
  const [companyAddress, setCompanyAddress] = useState("123 Avenue Cheikh Anta Diop, Dakar, Sénégal");
  const [taxId, setTaxId] = useState("SN123456789");
  const [currency, setCurrency] = useState("XOF");
  const [timezone, setTimezone] = useState("Africa/Dakar");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [invoiceReminders, setInvoiceReminders] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);

  // Attendance settings
  const [workStartTime, setWorkStartTime] = useState("08:00");
  const [workEndTime, setWorkEndTime] = useState("17:00");
  const [lateThreshold, setLateThreshold] = useState("15");
  const [autoCheckout, setAutoCheckout] = useState(true);

  // Invoice settings
  const [invoicePrefix, setInvoicePrefix] = useState("FAC");
  const [taxRate, setTaxRate] = useState("18");
  const [paymentTerms, setPaymentTerms] = useState("30");
  const [invoiceNotes, setInvoiceNotes] = useState("Merci pour votre confiance.");

  const handleSave = (section: string) => {
    toast({
      title: "Paramètres enregistrés",
      description: `Les paramètres ${section} ont été mis à jour.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground">Configurez votre plateforme SmartWork</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            Entreprise
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2">
            <Shield className="h-4 w-4" />
            Présences
          </TabsTrigger>
          <TabsTrigger value="invoicing" className="gap-2">
            <Palette className="h-4 w-4" />
            Facturation
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
              <CardDescription>Ces informations apparaîtront sur vos documents officiels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom de l'entreprise</Label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Numéro fiscal (NINEA)</Label>
                  <Input value={taxId} onChange={(e) => setTaxId(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Adresse</Label>
                  <Textarea value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Devise</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XOF">XOF - Franc CFA</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="USD">USD - Dollar US</SelectItem>
                      <SelectItem value="GNF">GNF - Franc Guinéen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fuseau horaire</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Dakar">Dakar (GMT+0)</SelectItem>
                      <SelectItem value="Africa/Abidjan">Abidjan (GMT+0)</SelectItem>
                      <SelectItem value="Africa/Lagos">Lagos (GMT+1)</SelectItem>
                      <SelectItem value="Africa/Douala">Douala (GMT+1)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => handleSave("de l'entreprise")}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>Choisissez comment vous souhaitez être notifié</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-muted-foreground">Recevoir les notifications par email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications push</p>
                    <p className="text-sm text-muted-foreground">Notifications dans le navigateur</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rappels de tâches</p>
                    <p className="text-sm text-muted-foreground">Rappel avant la date d'échéance</p>
                  </div>
                  <Switch checked={taskReminders} onCheckedChange={setTaskReminders} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertes de présence</p>
                    <p className="text-sm text-muted-foreground">Notification en cas d'absence ou retard</p>
                  </div>
                  <Switch checked={attendanceAlerts} onCheckedChange={setAttendanceAlerts} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rappels de factures</p>
                    <p className="text-sm text-muted-foreground">Rappel pour les factures impayées</p>
                  </div>
                  <Switch checked={invoiceReminders} onCheckedChange={setInvoiceReminders} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertes de stock</p>
                    <p className="text-sm text-muted-foreground">Notification quand le stock est faible</p>
                  </div>
                  <Switch checked={stockAlerts} onCheckedChange={setStockAlerts} />
                </div>
              </div>
              <Button onClick={() => handleSave("des notifications")}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Settings */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de présence</CardTitle>
              <CardDescription>Configurez les règles de pointage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heure de début de travail</Label>
                  <Input type="time" value={workStartTime} onChange={(e) => setWorkStartTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Heure de fin de travail</Label>
                  <Input type="time" value={workEndTime} onChange={(e) => setWorkEndTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tolérance de retard (minutes)</Label>
                  <Input
                    type="number"
                    value={lateThreshold}
                    onChange={(e) => setLateThreshold(e.target.value)}
                    min="0"
                    max="60"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sortie automatique</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Switch checked={autoCheckout} onCheckedChange={setAutoCheckout} />
                    <span className="text-sm text-muted-foreground">
                      Pointer automatiquement la sortie à {workEndTime}
                    </span>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSave("des présences")}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoicing Settings */}
        <TabsContent value="invoicing">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de facturation</CardTitle>
              <CardDescription>Configurez vos factures par défaut</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Préfixe des factures</Label>
                  <Input value={invoicePrefix} onChange={(e) => setInvoicePrefix(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Taux de TVA (%)</Label>
                  <Input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Délai de paiement (jours)</Label>
                  <Input
                    type="number"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Notes par défaut sur les factures</Label>
                  <Textarea
                    value={invoiceNotes}
                    onChange={(e) => setInvoiceNotes(e.target.value)}
                    placeholder="Ces notes apparaîtront en bas de chaque facture"
                  />
                </div>
              </div>
              <Button onClick={() => handleSave("de facturation")}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
