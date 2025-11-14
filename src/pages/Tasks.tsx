import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, User } from "lucide-react";

const tasks = {
  todo: [
    { id: 1, title: "Mise à jour du site web", assignee: "Marie Kouassi", priority: "Haute", dueDate: "2025-11-15" },
    { id: 2, title: "Réunion client Acme Corp", assignee: "Sophie Diallo", priority: "Moyenne", dueDate: "2025-11-16" },
  ],
  inProgress: [
    { id: 3, title: "Développement API v2", assignee: "Ibrahim Keita", priority: "Haute", dueDate: "2025-11-20" },
    { id: 4, title: "Design nouvelle interface", assignee: "Kofi Mensah", priority: "Moyenne", dueDate: "2025-11-18" },
  ],
  done: [
    { id: 5, title: "Rapport mensuel Q4", assignee: "Jean Touré", priority: "Basse", dueDate: "2025-11-13" },
    { id: 6, title: "Formation nouveaux employés", assignee: "Aminata Sow", priority: "Moyenne", dueDate: "2025-11-12" },
  ],
};

const TaskCard = ({ task }: { task: typeof tasks.todo[0] }) => {
  const priorityColors = {
    Haute: "destructive",
    Moyenne: "warning",
    Basse: "secondary",
  };

  return (
    <Card className="transition-all hover:shadow-md cursor-pointer">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
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
      </CardContent>
    </Card>
  );
};

export default function Tasks() {
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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* To Do */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">À faire</h2>
            <Badge variant="secondary">{tasks.todo.length}</Badge>
          </div>
          <div className="space-y-3">
            {tasks.todo.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">En cours</h2>
            <Badge className="bg-primary">{tasks.inProgress.length}</Badge>
          </div>
          <div className="space-y-3">
            {tasks.inProgress.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Done */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Terminé</h2>
            <Badge className="bg-success">{tasks.done.length}</Badge>
          </div>
          <div className="space-y-3">
            {tasks.done.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
