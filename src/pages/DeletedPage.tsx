import { Trash2 } from "lucide-react";

export default function DeletedPage() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Historial Eliminado</h1>
            <p className="text-muted-foreground">Elementos eliminados recuperables</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <Trash2 className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Sin elementos eliminados</h2>
        <p className="text-muted-foreground max-w-md">
          Los elementos que elimines aparecerán aquí y podrás recuperarlos.
        </p>
      </div>
    </div>
  );
}
