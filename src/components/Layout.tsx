import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Users, Clock, CheckSquare, UserCircle, Menu,
  FileText, Wallet, Package, MessageSquare, BarChart3, Settings
} from "lucide-react";
import { useState } from "react";
import "./Sidebar.css";

// Navigation groupée pour plus de clarté
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
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn("sidebar", sidebarOpen ? "sidebar--open" : "sidebar--closed")}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="sidebar__header">
            <div className="sidebar__logo">
              <LayoutDashboard className="sidebar__logo-icon" />
            </div>
            <div>
              <h1 className="sidebar__title">SmartWork</h1>
              <p className="sidebar__subtitle">Plateforme RH</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar__nav">
            {navigationGroups.map((group, groupIndex) => (
              <div key={group.label} className="sidebar__group">
                <p className="sidebar__group-label">{group.label}</p>
                <div className="sidebar__group-items">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "sidebar__link relative",
                          isActive && "sidebar__link--active"
                        )}
                      >
                        <item.icon className="sidebar__link-icon" />
                        <span className="sidebar__link-text">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
                {groupIndex < navigationGroups.length - 1 && (
                  <div className="sidebar__divider" />
                )}
              </div>
            ))}
          </nav>

          {/* User Footer */}
          <div className="sidebar__footer">
            <div className="sidebar__user">
              <div className="sidebar__avatar">A</div>
              <div className="sidebar__user-info">
                <p className="sidebar__user-name">Administrateur</p>
                <p className="sidebar__user-email">admin@smartwork.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <button
            onClick={() => setSidebarOpen(true)}
            className="topbar__menu-btn"
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
