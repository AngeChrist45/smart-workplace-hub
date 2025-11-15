import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar as CalendarIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AttendanceRecord } from "@/types";
import { exportAttendanceToPDF, exportAttendanceToExcel } from "@/utils/exports";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const initialRecords: AttendanceRecord[] = [
  { id: 1, name: "Marie Kouassi", employeeId: 1, date: "2025-11-14", checkIn: "08:15", checkOut: "17:30", status: "À l'heure", hours: "9h15" },
  { id: 2, name: "Jean Touré", employeeId: 2, date: "2025-11-14", checkIn: "08:45", checkOut: "18:00", status: "Retard", hours: "9h15" },
  { id: 3, name: "Sophie Diallo", employeeId: 3, date: "2025-11-14", checkIn: "08:00", checkOut: "17:00", status: "À l'heure", hours: "9h00" },
  { id: 4, name: "Ibrahim Keita", employeeId: 4, date: "2025-11-14", checkIn: "08:30", checkOut: "17:30", status: "À l'heure", hours: "9h00" },
  { id: 5, name: "Aminata Sow", employeeId: 5, date: "2025-11-14", checkIn: "09:15", checkOut: "18:15", status: "Retard", hours: "9h00" },
  { id: 6, name: "Kofi Mensah", employeeId: 6, date: "2025-11-14", checkIn: "-", checkOut: "-", status: "Absent", hours: "0h00" },
];

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const filteredRecords = records.filter(record => 
    record.date === format(selectedDate, "yyyy-MM-dd")
  );
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Présences</h1>
          <p className="mt-2 text-muted-foreground">
            Suivez les pointages et l'assiduité de vos employés
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(selectedDate, "dd MMM yyyy", { locale: fr })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={fr}
              />
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportAttendanceToPDF(filteredRecords)}>
                Exporter en PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportAttendanceToExcel(filteredRecords)}>
                Exporter en Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Présents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">42/48</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">En Retard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Absents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">6</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux Présence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">87.5%</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pointages du Jour</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Entrée</TableHead>
                <TableHead>Sortie</TableHead>
                <TableHead>Heures</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.checkIn}</TableCell>
                  <TableCell>{record.checkOut}</TableCell>
                  <TableCell>{record.hours}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === "À l'heure" ? "default" :
                        record.status === "Retard" ? "secondary" :
                        "destructive"
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
