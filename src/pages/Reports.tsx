import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Download, TrendingUp, Users, Clock, DollarSign, Package, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const attendanceData = [
  { month: "Jan", present: 92, late: 5, absent: 3 },
  { month: "Fév", present: 88, late: 8, absent: 4 },
  { month: "Mar", present: 95, late: 3, absent: 2 },
  { month: "Avr", present: 90, late: 6, absent: 4 },
  { month: "Mai", present: 93, late: 4, absent: 3 },
  { month: "Juin", present: 91, late: 5, absent: 4 },
];

const revenueData = [
  { month: "Jan", revenue: 4500000, expenses: 2800000, profit: 1700000 },
  { month: "Fév", revenue: 5200000, expenses: 3100000, profit: 2100000 },
  { month: "Mar", revenue: 4800000, expenses: 2900000, profit: 1900000 },
  { month: "Avr", revenue: 6100000, expenses: 3400000, profit: 2700000 },
  { month: "Mai", revenue: 5800000, expenses: 3200000, profit: 2600000 },
  { month: "Juin", revenue: 6500000, expenses: 3600000, profit: 2900000 },
];

const taskStatusData = [
  { name: "Terminées", value: 45, color: "#22c55e" },
  { name: "En cours", value: 30, color: "#3b82f6" },
  { name: "À faire", value: 25, color: "#f59e0b" },
];

const clientStatusData = [
  { name: "Actifs", value: 65, color: "#22c55e" },
  { name: "Leads", value: 25, color: "#3b82f6" },
  { name: "Perdus", value: 10, color: "#ef4444" },
];

const stockData = [
  { category: "Informatique", value: 15000000 },
  { category: "Mobilier", value: 5000000 },
  { category: "Fournitures", value: 2000000 },
  { category: "Équipement", value: 8000000 },
];

const topProducts = [
  { name: "Ordinateur HP", sales: 25, revenue: 11250000 },
  { name: "Écran 24\"", sales: 40, revenue: 7200000 },
  { name: "Imprimante Canon", sales: 15, revenue: 1875000 },
  { name: "Chaise bureau", sales: 30, revenue: 2250000 },
];

const Reports = () => {
  const [period, setPeriod] = useState("month");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(amount);
  };

  const exportReportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Rapport Global", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, 105, 28, { align: "center" });

    // Summary
    doc.setFontSize(14);
    doc.text("Résumé", 14, 45);

    autoTable(doc, {
      startY: 50,
      head: [["Indicateur", "Valeur"]],
      body: [
        ["Chiffre d'affaires (6 mois)", formatCurrency(revenueData.reduce((s, r) => s + r.revenue, 0))],
        ["Bénéfice net", formatCurrency(revenueData.reduce((s, r) => s + r.profit, 0))],
        ["Taux de présence moyen", "91%"],
        ["Tâches terminées", "45"],
        ["Clients actifs", "65"],
      ],
      theme: "grid",
      headStyles: { fillColor: [99, 102, 241] },
    });

    // Top Products
    const y1 = (doc as any).lastAutoTable.finalY + 15;
    doc.text("Top Produits", 14, y1);

    autoTable(doc, {
      startY: y1 + 5,
      head: [["Produit", "Ventes", "Revenue"]],
      body: topProducts.map((p) => [p.name, p.sales.toString(), formatCurrency(p.revenue)]),
      theme: "grid",
      headStyles: { fillColor: [99, 102, 241] },
    });

    doc.save(`rapport-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const totalRevenue = revenueData.reduce((sum, r) => sum + r.revenue, 0);
  const totalProfit = revenueData.reduce((sum, r) => sum + r.profit, 0);
  const avgAttendance = Math.round(attendanceData.reduce((sum, a) => sum + a.present, 0) / attendanceData.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rapports & Analyses</h1>
          <p className="text-muted-foreground">Vue d'ensemble des performances</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReportToPDF}>
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
                <p className="text-xl font-bold">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-green-600">+12% vs période préc.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bénéfice net</p>
                <p className="text-xl font-bold">{formatCurrency(totalProfit)}</p>
                <p className="text-xs text-green-600">+8% vs période préc.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taux de présence</p>
                <p className="text-xl font-bold">{avgAttendance}%</p>
                <p className="text-xs text-green-600">+2% vs période préc.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valeur stock</p>
                <p className="text-xl font-bold">{formatCurrency(30000000)}</p>
                <p className="text-xs text-muted-foreground">120 produits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenus et Bénéfices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Revenus" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="profit" name="Bénéfice" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Suivi des Présences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" name="Présent" fill="#22c55e" />
                <Bar dataKey="late" name="Retard" fill="#f59e0b" />
                <Bar dataKey="absent" name="Absent" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statut des Tâches</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={clientStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {clientStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valeur du Stock par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stockData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `${value / 1000000}M`} />
                <YAxis dataKey="category" type="category" width={100} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Top Produits Vendus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Produit</th>
                  <th className="text-center py-3 px-4">Ventes</th>
                  <th className="text-right py-3 px-4">Revenu</th>
                  <th className="text-right py-3 px-4">% du total</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => {
                  const totalSalesRevenue = topProducts.reduce((s, p) => s + p.revenue, 0);
                  const percentage = ((product.revenue / totalSalesRevenue) * 100).toFixed(1);
                  return (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{product.name}</td>
                      <td className="py-3 px-4 text-center">{product.sales}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(product.revenue)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm">{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
