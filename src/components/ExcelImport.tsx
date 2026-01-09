import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExcelImportProps<T> {
  onImport: (data: T[]) => void;
  expectedColumns: { key: string; label: string; required?: boolean }[];
  templateName: string;
  parseRow: (row: Record<string, any>) => T | null;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost";
  buttonLabel?: string;
}

export function ExcelImport<T>({
  onImport,
  expectedColumns,
  templateName,
  parseRow,
  buttonVariant = "outline",
  buttonLabel = "Importer Excel",
}: ExcelImportProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewData, setPreviewData] = useState<Record<string, any>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrors([]);
    setPreviewData([]);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        setErrors(["Le fichier est vide ou mal formaté"]);
        setIsProcessing(false);
        return;
      }

      // Check for required columns
      const firstRow = jsonData[0] as Record<string, any>;
      const fileColumns = Object.keys(firstRow);
      const missingColumns = expectedColumns
        .filter((col) => col.required)
        .filter((col) => !fileColumns.some(
          (fc) => fc.toLowerCase().trim() === col.label.toLowerCase().trim()
        ));

      if (missingColumns.length > 0) {
        setErrors([
          `Colonnes manquantes: ${missingColumns.map((c) => c.label).join(", ")}`,
        ]);
      }

      setPreviewData(jsonData.slice(0, 10) as Record<string, any>[]);
      setIsDialogOpen(true);
    } catch (error) {
      setErrors(["Erreur lors de la lecture du fichier Excel"]);
    }

    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmImport = async () => {
    setIsProcessing(true);
    
    try {
      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        // Use preview data if file is not available
        const parsedData = previewData
          .map((row) => parseRow(normalizeRowKeys(row)))
          .filter((item): item is T => item !== null);
        
        onImport(parsedData);
        setIsDialogOpen(false);
        setPreviewData([]);
        setIsProcessing(false);
        return;
      }

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];

      const parsedData = jsonData
        .map((row) => parseRow(normalizeRowKeys(row)))
        .filter((item): item is T => item !== null);

      onImport(parsedData);
      setIsDialogOpen(false);
      setPreviewData([]);
    } catch (error) {
      setErrors(["Erreur lors de l'import des données"]);
    }

    setIsProcessing(false);
  };

  const normalizeRowKeys = (row: Record<string, any>): Record<string, any> => {
    const normalized: Record<string, any> = {};
    for (const [key, value] of Object.entries(row)) {
      const normalizedKey = key.toLowerCase().trim();
      normalized[normalizedKey] = value;
    }
    return normalized;
  };

  const downloadTemplate = () => {
    const templateData = [
      expectedColumns.reduce((acc, col) => {
        acc[col.label] = col.required ? "Requis" : "Optionnel";
        return acc;
      }, {} as Record<string, string>),
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, `template-${templateName}.xlsx`);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        variant={buttonVariant}
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        {buttonLabel}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Aperçu de l'import
            </DialogTitle>
            <DialogDescription>
              Vérifiez les données avant de confirmer l'import
            </DialogDescription>
          </DialogHeader>

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errors.map((error, i) => (
                  <div key={i}>{error}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          {previewData.length > 0 && (
            <>
              <Alert>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  {previewData.length} lignes détectées (aperçu des 10 premières)
                </AlertDescription>
              </Alert>

              <ScrollArea className="h-[300px] border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(previewData[0]).map((key) => (
                        <TableHead key={key} className="whitespace-nowrap">
                          {key}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, i) => (
                          <TableCell key={i} className="whitespace-nowrap">
                            {String(value ?? "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </>
          )}

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={downloadTemplate} className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Télécharger le template
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleConfirmImport}
                disabled={errors.length > 0 || isProcessing}
              >
                {isProcessing ? "Import en cours..." : "Confirmer l'import"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
