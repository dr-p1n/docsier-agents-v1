import { Mail, FileText, Brain, Clock } from "lucide-react";

const stats = [
  { label: "Correos urgentes", value: "3", icon: Mail, color: "text-destructive" },
  { label: "Documentos pendientes", value: "7", icon: FileText, color: "text-[hsl(var(--status-warning))]" },
  { label: "Tareas hoy", value: "5", icon: Brain, color: "text-primary" },
  { label: "Vencimientos próximos", value: "2", icon: Clock, color: "text-[hsl(var(--accent-teal))]" },
];

export default function Dashboard() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Buenos días</h1>
        <p className="text-muted-foreground mt-1">Tu resumen del día</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-lg p-4 border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Cards */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Acceso rápido</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <AgentCard
          title="La Secretaria"
          description="Gestiona tu bandeja de entrada con IA"
          icon={Mail}
          href="/secretaria"
        />
        <AgentCard
          title="La Archivista"
          description="Organiza documentos automáticamente"
          icon={FileText}
          href="/archivista"
        />
        <AgentCard
          title="Smart Context"
          description="Tareas y deadlines inteligentes"
          icon={Brain}
          href="/smart-context"
        />
      </div>
    </div>
  );
}

function AgentCard({
  title,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block bg-card rounded-lg p-5 border border-border hover:border-primary/50 hover:bg-muted/30 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </a>
  );
}
