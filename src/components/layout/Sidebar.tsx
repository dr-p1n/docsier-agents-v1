import { NavLink, useLocation } from "react-router-dom";
import { Mail, FileText, Brain, Trash2, Settings, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onLogout: () => void;
}

const navItems = {
  agents: [
    { label: "La Secretaria", icon: Mail, path: "/secretaria" },
    { label: "La Archivista", icon: FileText, path: "/archivista" },
    { label: "Smart Context", icon: Brain, path: "/smart-context" },
  ],
  system: [
    { label: "Historial Eliminado", icon: Trash2, path: "/deleted" },
    { label: "Configuración", icon: Settings, path: "/settings" },
  ],
};

export function Sidebar({ isOpen, onClose, userEmail, onLogout }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-[260px] bg-sidebar flex flex-col z-50 transition-transform duration-300",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold text-foreground">DOCSIER</h1>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md hover:bg-muted"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="h-px bg-border mx-4" />

        {/* Agents Section */}
        <nav className="flex-1 py-4">
          <p className="px-6 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Agentes
          </p>
          {navItems.agents.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 mx-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/15 border-l-[3px] border-primary text-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            );
          })}

          <div className="h-px bg-border mx-4 my-4" />

          {/* System Section */}
          <p className="px-6 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Sistema
          </p>
          {navItems.system.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 mx-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/15 border-l-[3px] border-primary text-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground truncate max-w-[180px]">
              {userEmail || "usuario@ejemplo.com"}
            </span>
            <button
              onClick={onLogout}
              className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
