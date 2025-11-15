import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, User, Download, Edit, Trash2, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TaskForm } from "@/components/forms/TaskForm";
import { Task } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { exportTasksToPDF, exportTasksToExcel } from "@/utils/exports";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const initialTasks: Task[] = [
  { id: 1, title: "Mise à jour du site web", assignee: "Marie Kouassi", priority: "Haute", status: "todo", dueDate: "2025-11-15", description: "Mise à jour complète du site web de l'entreprise" },
  { id: 2, title: "Réunion client Acme Corp", assignee: "Sophie Diallo", priority: "Moyenne", status: "todo", dueDate: "2025-11-16" },
  { id: 3, title: "Développement API v2", assignee: "Ibrahim Keita", priority: "Haute", status: "inProgress", dueDate: "2025-11-20" },
  { id: 4, title: "Design nouvelle interface", assignee: "Kofi Mensah", priority: "Moyenne", status: "inProgress", dueDate: "2025-11-18" },
  { id: 5, title: "Rapport mensuel Q4", assignee: "Jean Touré", priority: "Basse", status: "done", dueDate: "2025-11-13" },
  { id: 6, title: "Formation nouveaux employés", assignee: "Aminata Sow", priority: "Moyenne", status: "done", dueDate: "2025-11-12" },
];

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const priorityColors = {
    Haute: "destructive",
    Moyenne: "warning",
    Basse: "secondary",
  };

  return (
    <Card className="transition-all hover:shadow-md group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <GripVertical className="h-5 w-5 text-muted-foreground cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardTitle className="text-base font-medium flex-1">{task.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{task.assignee}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{task.dueDate}</span>
        </div>
        <Badge variant={priorityColors[task.priority as keyof typeof priorityColors] as any}>
          Priorité {task.priority}
        </Badge>
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onEdit(task)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    inProgress: tasks.filter(t => t.status === 'inProgress'),
    done: tasks.filter(t => t.status === 'done'),
  };

  const handleSubmit = (data: any) => {
    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...data }
          : task
      ));
      toast({ title: "Tâche modifiée avec succès" });
    } else {
      const newTask: Task = {
        id: Math.max(...tasks.map(t => t.id)) + 1,
        ...data,
      };
      setTasks(prev => [...prev, newTask]);
      toast({ title: "Tâche créée avec succès" });
    }
    setIsDialogOpen(false);
    setEditingTask(undefined);
  };

  const handleDelete = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({ title: "Tâche supprimée" });
    setDeleteId(null);
  };
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tâches & Missions</h1>
          <p className="mt-2 text-muted-foreground">
            Organisez et suivez les tâches de votre équipe
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportTasksToPDF(tasks)}>
                Exporter en PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportTasksToExcel(tasks)}>
                Exporter en Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setEditingTask(undefined)}>
                <Plus className="h-4 w-4" />
                Nouvelle tâche
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
                </DialogTitle>
              </DialogHeader>
              <TaskForm
                task={editingTask}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingTask(undefined);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* To Do */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">À faire</h2>
            <Badge variant="secondary">{tasksByStatus.todo.length}</Badge>
          </div>
          <div className="space-y-3">
            {tasksByStatus.todo.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task}
                onEdit={(task) => {
                  setEditingTask(task);
                  setIsDialogOpen(true);
                }}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
            {tasksByStatus.todo.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Aucune tâche à faire
              </div>
            )}
          </div>
        </div>

        {/* In Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">En cours</h2>
            <Badge className="bg-primary">{tasksByStatus.inProgress.length}</Badge>
          </div>
          <div className="space-y-3">
            {tasksByStatus.inProgress.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task}
                onEdit={(task) => {
                  setEditingTask(task);
                  setIsDialogOpen(true);
                }}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
            {tasksByStatus.inProgress.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Aucune tâche en cours
              </div>
            )}
          </div>
        </div>

        {/* Done */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Terminé</h2>
            <Badge className="bg-success">{tasksByStatus.done.length}</Badge>
          </div>
          <div className="space-y-3">
            {tasksByStatus.done.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task}
                onEdit={(task) => {
                  setEditingTask(task);
                  setIsDialogOpen(true);
                }}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
            {tasksByStatus.done.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Aucune tâche terminée
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
