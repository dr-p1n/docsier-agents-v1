import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // For now, just redirect to login
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userEmail="demo@docsier.app"
        onLogout={handleLogout}
      />

      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border flex items-center px-4 md:hidden z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md hover:bg-muted"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="ml-3 text-lg font-bold text-foreground">DOCSIER</h1>
      </header>

      {/* Main content */}
      <main className="md:ml-[260px] pt-14 md:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
