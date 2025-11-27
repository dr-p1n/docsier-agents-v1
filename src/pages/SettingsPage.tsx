import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground">Preferencias de la aplicación</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl space-y-6">
        {/* Profile Section */}
        <section className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Perfil</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                defaultValue="Usuario Demo"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Firma
              </label>
              <input
                type="text"
                defaultValue="DOCSIER Legal"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Preferencias</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Zona horaria
              </label>
              <select className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="America/Panama">América/Panamá (GMT-5)</option>
                <option value="America/New_York">América/Nueva York (GMT-5)</option>
                <option value="America/Los_Angeles">América/Los Ángeles (GMT-8)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Idioma
              </label>
              <select className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
