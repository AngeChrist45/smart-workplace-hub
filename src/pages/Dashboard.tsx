import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, CheckSquare, UserCircle, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Employés",
      value: 48,
      icon: Users,
      variant: "primary" as const,
      trend: { value: "+12% ce mois", isPositive: true }
    },
    {
      title: "Présents Aujourd'hui",
      value: 42,
      icon: Clock,
      variant: "success" as const,
      trend: { value: "87.5%", isPositive: true }
    },
    {
      title: "Tâches Actives",
      value: 23,
      icon: CheckSquare,
      variant: "accent" as const,
    },
    {
      title: "Clients Actifs",
      value: 156,
      icon: UserCircle,
      variant: "default" as const,
      trend: { value: "+8 cette semaine", isPositive: true }
    },
  ];

  const recentActivity = [
    { name: "Marie Kouassi", action: "a pointé à l'entrée", time: "Il y a 5 min", type: "presence" },
    { name: "Jean Touré", action: "a terminé la tâche 'Rapport Q4'", time: "Il y a 15 min", type: "task" },
    { name: "Sophie Diallo", action: "a ajouté un nouveau client", time: "Il y a 1h", type: "client" },
    { name: "Kofi Mensah", action: "est en retard", time: "Il y a 2h", type: "late" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="mt-2 text-muted-foreground">
          Bienvenue ! Voici un aperçu de votre entreprise aujourd'hui.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className={`mt-1 h-2 w-2 rounded-full ${
                    activity.type === 'presence' ? 'bg-success' :
                    activity.type === 'task' ? 'bg-primary' :
                    activity.type === 'client' ? 'bg-accent' :
                    'bg-destructive'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium text-foreground">{activity.name}</span>
                      <span className="text-muted-foreground"> {activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Résumé de la Semaine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="text-sm text-muted-foreground">Taux de présence moyen</span>
              <span className="text-lg font-bold text-success">89.2%</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="text-sm text-muted-foreground">Tâches complétées</span>
              <span className="text-lg font-bold text-primary">67/89</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="text-sm text-muted-foreground">Nouveaux clients</span>
              <span className="text-lg font-bold text-accent">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Retards cette semaine</span>
              <span className="text-lg font-bold text-destructive">8</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
