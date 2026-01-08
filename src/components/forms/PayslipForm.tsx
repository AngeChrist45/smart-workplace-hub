import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Payslip } from "@/types";

interface PayslipFormProps {
  onSubmit: (data: Partial<Payslip>) => void;
  onCancel: () => void;
}

export const PayslipForm = ({ onSubmit, onCancel }: PayslipFormProps) => {
  const [employeeName, setEmployeeName] = useState("");
  const [period, setPeriod] = useState("");
  const [baseSalary, setBaseSalary] = useState(0);
  const [bonuses, setBonuses] = useState(0);
  const [deductions, setDeductions] = useState(0);

  const netSalary = baseSalary + bonuses - deductions;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ employeeName, employeeId: 1, period, baseSalary, bonuses, deductions, netSalary });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><Label>Employé</Label><Input value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required /></div>
      <div><Label>Période</Label><Input placeholder="Janvier 2024" value={period} onChange={(e) => setPeriod(e.target.value)} required /></div>
      <div><Label>Salaire de base (XOF)</Label><Input type="number" value={baseSalary} onChange={(e) => setBaseSalary(parseInt(e.target.value) || 0)} /></div>
      <div><Label>Primes et bonus</Label><Input type="number" value={bonuses} onChange={(e) => setBonuses(parseInt(e.target.value) || 0)} /></div>
      <div><Label>Déductions</Label><Input type="number" value={deductions} onChange={(e) => setDeductions(parseInt(e.target.value) || 0)} /></div>
      <div className="p-3 bg-muted rounded-lg"><p className="text-sm text-muted-foreground">Salaire Net</p><p className="text-xl font-bold">{netSalary.toLocaleString()} XOF</p></div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">Créer</Button>
      </div>
    </form>
  );
};
