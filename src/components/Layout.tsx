import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Users, Clock, CheckSquare, UserCircle, Menu,
  FileText, Wallet, Package, MessageSquare, BarChart3, Settings
} from "lucide-react";
import { useState } from "react";

const navigationGroups = [
  {
    label: "Principal",
    items: [
      { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
    ]
  },
  {
    label: "Ressources Humaines",
    items: [
      { name: "Employés", href: "/employees", icon: Users },
      { name: "Présences", href: "/attendance", icon: Clock },
      { name: "Bulletins de paie", href: "/payslips", icon: Wallet },
    ]
  },
  {
    label: "Gestion",
    items: [
      { name: "Tâches", href: "/tasks", icon: CheckSquare },
      { name: "Clients", href: "/clients", icon: UserCircle },
      { name: "Factures", href: "/invoices", icon: FileText },
      { name: "Inventaire", href: "/inventory", icon: Package },
    ]
  },
  {
    label: "Communication",
    items: [
      { name: "Messagerie", href: "/messaging", icon: MessageSquare },
    ]
  },
  {
    label: "Analyse",
    items: [
      { name: "Rapports", href: "/reports", icon: BarChart3 },
      { name: "Paramètres", href: "/settings", icon: Settings },
    ]
  },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 bg-sidebar border-r border-sidebar-border",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center gap-4 px-6 border-b border-sidebar-border/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
              <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground">SmartWork</h1>
              <p className="text-xs font-medium tracking-wide uppercase text-sidebar-foreground/50">Plateforme RH</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            {navigationGroups.map((group, groupIndex) => (
              <div key={group.label} className="mb-6">
                <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 hover:translate-x-1",
                          isActive && "bg-sidebar-accent text-sidebar-foreground shadow-sm"
                        )}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
                {groupIndex < navigationGroups.length - 1 && (
                  <div className="my-4 mx-3 h-px bg-gradient-to-r from-transparent via-sidebar-border/50 to-transparent" />
                )}
              </div>
            ))}
          </nav>

          {/* User Footer */}
          <div className="p-4 mx-4 mb-4 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-sm text-primary-foreground shadow-md">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-sidebar-foreground">Administrateur</p>
                <p className="text-xs truncate text-sidebar-foreground/50">admin@smartwork.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 px-4 sm:px-6 bg-card/80 backdrop-blur-xl border-b border-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden rounded-xl p-2.5 hover:bg-muted text-foreground"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
