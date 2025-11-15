import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { AttendanceRecord, Employee, Task, Client } from "@/types";

export const exportAttendanceToPDF = (records: AttendanceRecord[], title: string = "Rapport de Présence") => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

  autoTable(doc, {
    startY: 35,
    head: [['Employé', 'Date', 'Entrée', 'Sortie', 'Heures', 'Statut']],
    body: records.map(record => [
      record.name,
      record.date,
      record.checkIn,
      record.checkOut,
      record.hours,
      record.status
    ]),
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
  });

  doc.save(`presence-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportAttendanceToExcel = (records: AttendanceRecord[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    records.map(record => ({
      'Employé': record.name,
      'Date': record.date,
      'Entrée': record.checkIn,
      'Sortie': record.checkOut,
      'Heures': record.hours,
      'Statut': record.status
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Présences");
  
  XLSX.writeFile(workbook, `presence-${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportEmployeesToPDF = (employees: Employee[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text("Liste des Employés", 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

  autoTable(doc, {
    startY: 35,
    head: [['Nom', 'Poste', 'Email', 'Téléphone', 'Statut']],
    body: employees.map(emp => [
      emp.name,
      emp.role,
      emp.email,
      emp.phone,
      emp.status
    ]),
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
  });

  doc.save(`employes-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportEmployeesToExcel = (employees: Employee[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    employees.map(emp => ({
      'Nom': emp.name,
      'Poste': emp.role,
      'Email': emp.email,
      'Téléphone': emp.phone,
      'Département': emp.department || '',
      'Statut': emp.status
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Employés");
  
  XLSX.writeFile(workbook, `employes-${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportTasksToPDF = (tasks: Task[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text("Liste des Tâches", 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

  const allTasks = [...tasks];

  autoTable(doc, {
    startY: 35,
    head: [['Titre', 'Assigné', 'Priorité', 'Statut', 'Date Limite']],
    body: allTasks.map(task => [
      task.title,
      task.assignee,
      task.priority,
      task.status === 'todo' ? 'À faire' : task.status === 'inProgress' ? 'En cours' : 'Terminé',
      task.dueDate
    ]),
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
  });

  doc.save(`taches-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportTasksToExcel = (tasks: Task[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    tasks.map(task => ({
      'Titre': task.title,
      'Description': task.description || '',
      'Assigné': task.assignee,
      'Priorité': task.priority,
      'Statut': task.status === 'todo' ? 'À faire' : task.status === 'inProgress' ? 'En cours' : 'Terminé',
      'Date Limite': task.dueDate
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tâches");
  
  XLSX.writeFile(workbook, `taches-${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportClientsToPDF = (clients: Client[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text("Liste des Clients", 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

  autoTable(doc, {
    startY: 35,
    head: [['Nom', 'Contact', 'Email', 'Téléphone', 'Statut', 'Valeur']],
    body: clients.map(client => [
      client.name,
      client.contact,
      client.email,
      client.phone,
      client.status,
      client.value
    ]),
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
  });

  doc.save(`clients-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportClientsToExcel = (clients: Client[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    clients.map(client => ({
      'Nom': client.name,
      'Contact': client.contact,
      'Email': client.email,
      'Téléphone': client.phone,
      'Entreprise': client.company || '',
      'Statut': client.status,
      'Valeur': client.value,
      'Dernier Contact': client.lastContact
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
  
  XLSX.writeFile(workbook, `clients-${new Date().toISOString().split('T')[0]}.xlsx`);
};
