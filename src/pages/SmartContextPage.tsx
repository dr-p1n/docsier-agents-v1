import { Brain } from "lucide-react";

export default function SmartContextPage() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Smart Context</h1>
            <p className="text-muted-foreground">Tareas y deadlines inteligentes</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <Brain className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Próximamente</h2>
        <p className="text-muted-foreground max-w-md">
          Smart Context extraerá tareas automáticamente de correos y documentos, priorizándolas inteligentemente.
        </p>
      </div>
    </div>
  );
}
