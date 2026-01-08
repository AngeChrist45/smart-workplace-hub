import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, MessageCircle, Send, Users, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Message } from "@/types";
import { useToast } from "@/hooks/use-toast";

const initialMessages: Message[] = [
  {
    id: 1,
    type: "email",
    to: "client@techcorp.com",
    subject: "Confirmation de rendez-vous",
    content: "Bonjour, nous confirmons votre rendez-vous du 15 janvier à 10h.",
    status: "Envoyé",
    sentAt: "2024-01-14 09:30",
    createdAt: "2024-01-14",
  },
  {
    id: 2,
    type: "whatsapp",
    to: "+221 77 123 4567",
    content: "Bonjour, votre commande est prête. Vous pouvez venir la récupérer.",
    status: "Envoyé",
    sentAt: "2024-01-13 14:20",
    createdAt: "2024-01-13",
  },
  {
    id: 3,
    type: "email",
    to: "prospect@startup.com",
    subject: "Proposition commerciale",
    content: "Suite à notre entretien, veuillez trouver ci-joint notre proposition.",
    status: "Brouillon",
    createdAt: "2024-01-15",
  },
];

const emailTemplates = [
  { id: 1, name: "Confirmation RDV", subject: "Confirmation de votre rendez-vous", content: "Bonjour {{nom}},\n\nNous confirmons votre rendez-vous prévu le {{date}} à {{heure}}.\n\nCordialement,\nL'équipe SmartWork" },
  { id: 2, name: "Relance facture", subject: "Rappel - Facture en attente", content: "Bonjour {{nom}},\n\nNous vous rappelons que la facture n°{{facture}} reste en attente de règlement.\n\nCordialement" },
  { id: 3, name: "Bienvenue", subject: "Bienvenue chez nous !", content: "Bonjour {{nom}},\n\nNous sommes ravis de vous compter parmi nos clients.\n\nN'hésitez pas à nous contacter pour toute question.\n\nCordialement" },
];

const whatsappTemplates = [
  { id: 1, name: "Rappel RDV", content: "Bonjour ! Rappel pour votre RDV demain à {{heure}}. À bientôt !" },
  { id: 2, name: "Commande prête", content: "Bonjour ! Votre commande est prête. Passez la récupérer quand vous voulez." },
  { id: 3, name: "Suivi client", content: "Bonjour {{nom}} ! Comment allez-vous ? Avez-vous des questions sur nos services ?" },
];

const Messaging = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messageType, setMessageType] = useState<"email" | "whatsapp">("email");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const { toast } = useToast();

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (messageType === "email") {
      const template = emailTemplates.find((t) => t.id.toString() === templateId);
      if (template) {
        setSubject(template.subject);
        setContent(template.content);
      }
    } else {
      const template = whatsappTemplates.find((t) => t.id.toString() === templateId);
      if (template) {
        setContent(template.content);
      }
    }
  };

  const handleSend = () => {
    if (!to || !content) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs requis.", variant: "destructive" });
      return;
    }

    const newMessage: Message = {
      id: Math.max(...messages.map((m) => m.id)) + 1,
      type: messageType,
      to,
      subject: messageType === "email" ? subject : undefined,
      content,
      status: "Envoyé",
      sentAt: new Date().toLocaleString("fr-FR"),
      createdAt: new Date().toISOString().split("T")[0],
    };

    setMessages([newMessage, ...messages]);
    setIsDialogOpen(false);
    resetForm();
    
    toast({
      title: messageType === "email" ? "Email envoyé" : "WhatsApp envoyé",
      description: `Message envoyé à ${to}`,
    });
  };

  const handleSaveDraft = () => {
    const newMessage: Message = {
      id: Math.max(...messages.map((m) => m.id)) + 1,
      type: messageType,
      to,
      subject: messageType === "email" ? subject : undefined,
      content,
      status: "Brouillon",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setMessages([newMessage, ...messages]);
    setIsDialogOpen(false);
    resetForm();
    
    toast({ title: "Brouillon enregistré", description: "Le message a été sauvegardé." });
  };

  const resetForm = () => {
    setTo("");
    setSubject("");
    setContent("");
    setSelectedTemplate("");
  };

  const getStatusBadge = (status: Message["status"]) => {
    const config = {
      Brouillon: { icon: Clock, class: "bg-muted text-muted-foreground" },
      Envoyé: { icon: CheckCircle, class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
      Erreur: { icon: AlertCircle, class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    };
    const { icon: Icon, class: className } = config[status];
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const emailCount = messages.filter((m) => m.type === "email" && m.status === "Envoyé").length;
  const whatsappCount = messages.filter((m) => m.type === "whatsapp" && m.status === "Envoyé").length;
  const draftCount = messages.filter((m) => m.status === "Brouillon").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messagerie</h1>
          <p className="text-muted-foreground">Envoyez des emails et messages WhatsApp</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Nouveau message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Envoyer un message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Tabs value={messageType} onValueChange={(v) => { setMessageType(v as "email" | "whatsapp"); resetForm(); }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="whatsapp">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                <div>
                  <Label>Modèle (optionnel)</Label>
                  <Select value={selectedTemplate} onValueChange={handleSelectTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {(messageType === "email" ? emailTemplates : whatsappTemplates).map((template) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{messageType === "email" ? "Email destinataire" : "Numéro WhatsApp"}</Label>
                  <Input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder={messageType === "email" ? "exemple@email.com" : "+221 77 123 4567"}
                  />
                </div>

                {messageType === "email" && (
                  <div>
                    <Label>Objet</Label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Objet de l'email"
                    />
                  </div>
                )}

                <div>
                  <Label>Message</Label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Votre message..."
                    rows={6}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={handleSaveDraft}>
                    Enregistrer brouillon
                  </Button>
                  <Button onClick={handleSend}>
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Emails envoyés</p>
              <p className="text-2xl font-bold text-foreground">{emailCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">WhatsApp envoyés</p>
              <p className="text-2xl font-bold text-foreground">{whatsappCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Brouillons</p>
              <p className="text-2xl font-bold text-foreground">{draftCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total messages</p>
              <p className="text-2xl font-bold text-foreground">{messages.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="email">Emails</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="drafts">Brouillons</TabsTrigger>
        </TabsList>

        {["all", "email", "whatsapp", "drafts"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Destinataire</TableHead>
                    <TableHead>Objet/Contenu</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages
                    .filter((m) => {
                      if (tab === "all") return true;
                      if (tab === "drafts") return m.status === "Brouillon";
                      return m.type === tab;
                    })
                    .map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          {message.type === "email" ? (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-blue-600" />
                              <span>Email</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4 text-green-600" />
                              <span>WhatsApp</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{message.to}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {message.subject && <p className="font-medium">{message.subject}</p>}
                            <p className="text-sm text-muted-foreground truncate">{message.content}</p>
                          </div>
                        </TableCell>
                        <TableCell>{message.sentAt || message.createdAt}</TableCell>
                        <TableCell>{getStatusBadge(message.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Templates section */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Modèles disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              Modèles Email
            </h3>
            <div className="space-y-2">
              {emailTemplates.map((template) => (
                <div key={template.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground">{template.subject}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-green-600" />
              Modèles WhatsApp
            </h3>
            <div className="space-y-2">
              {whatsappTemplates.map((template) => (
                <div key={template.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{template.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
