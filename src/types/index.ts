export interface Employee {
  id: number;
  name: string;
  role: string;
  status: "Actif" | "En congé" | "Inactif";
  email: string;
  phone: string;
  avatar: string;
  department?: string;
  dateHired?: string;
  qrCode?: string;
  salary?: number;
  bankAccount?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  assignee: string;
  assigneeId?: number;
  priority: "Haute" | "Moyenne" | "Basse";
  status: "todo" | "inProgress" | "done";
  dueDate: string;
  createdAt?: string;
}

export interface Client {
  id: number;
  name: string;
  contact: string;
  status: "Actif" | "Lead" | "Perdu";
  email: string;
  phone: string;
  lastContact: string;
  value: string;
  company?: string;
  address?: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: number;
  name: string;
  employeeId: number;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "À l'heure" | "Retard" | "Absent";
  hours: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  clientId: number;
  clientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "Brouillon" | "Envoyée" | "Payée" | "En retard" | "Annulée";
  notes?: string;
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payslip {
  id: number;
  employeeId: number;
  employeeName: string;
  period: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  status: "Brouillon" | "Validé" | "Payé";
  paymentDate?: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  unitPrice: number;
  costPrice: number;
  supplier?: string;
  status: "En stock" | "Stock faible" | "Rupture";
}

export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  type: "Entrée" | "Sortie" | "Ajustement";
  quantity: number;
  date: string;
  reference?: string;
  notes?: string;
}

export interface Message {
  id: number;
  type: "email" | "whatsapp";
  to: string;
  subject?: string;
  content: string;
  status: "Brouillon" | "Envoyé" | "Erreur";
  sentAt?: string;
  createdAt: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address?: string;
  products?: string[];
}
