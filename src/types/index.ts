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
