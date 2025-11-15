import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";

export default function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<{
    name: string;
    time: string;
    type: "in" | "out";
  } | null>(null);
  const { toast } = useToast();

  // Simulated employee data - in real app, this would come from backend
  const employee = {
    id: "EMP001",
    name: "Marie Kouassi",
    qrCode: "EMP001-QR-CODE-DATA"
  };

  const handleCheckIn = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    setLastScan({
      name: employee.name,
      time: timeStr,
      type: "in"
    });

    toast({
      title: "Pointage enregistré",
      description: `Entrée enregistrée à ${timeStr}`,
    });
  };

  const handleCheckOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    setLastScan({
      name: employee.name,
      time: timeStr,
      type: "out"
    });

    toast({
      title: "Pointage enregistré",
      description: `Sortie enregistrée à ${timeStr}`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6 py-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Pointage QR Code</h1>
          <p className="text-muted-foreground mt-2">
            Scannez votre code pour pointer
          </p>
        </div>

        {/* Employee QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Votre Code QR</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG 
                value={employee.qrCode}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">{employee.name}</p>
              <p className="text-sm text-muted-foreground">{employee.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            size="lg" 
            className="h-24 flex-col gap-2"
            onClick={handleCheckIn}
          >
            <Clock className="h-6 w-6" />
            <span>Pointer Entrée</span>
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={handleCheckOut}
          >
            <Clock className="h-6 w-6" />
            <span>Pointer Sortie</span>
          </Button>
        </div>

        {/* Last Scan Info */}
        {lastScan && (
          <Card className={`border-2 ${lastScan.type === 'in' ? 'border-success' : 'border-primary'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-3 ${lastScan.type === 'in' ? 'bg-success/10' : 'bg-primary/10'}`}>
                  {lastScan.type === 'in' ? (
                    <CheckCircle className={`h-6 w-6 ${lastScan.type === 'in' ? 'text-success' : 'text-primary'}`} />
                  ) : (
                    <XCircle className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {lastScan.type === 'in' ? 'Entrée enregistrée' : 'Sortie enregistrée'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lastScan.time}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comment ça marche ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Présentez votre code QR au scanner à l'entrée</p>
            <p>2. Le système enregistre automatiquement votre heure d'arrivée</p>
            <p>3. Scannez à nouveau en partant pour enregistrer votre sortie</p>
            <p className="text-xs pt-2 text-muted-foreground/80">
              * En cas de problème, contactez les RH
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
