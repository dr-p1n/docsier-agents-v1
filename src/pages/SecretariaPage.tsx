import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Users, CheckCircle2, Undo2 } from 'lucide-react';
import { getClients, getClientDeadlineStats, markDeadlineComplete, markDeadlineUncomplete } from '../services/clients';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Deadline, DeadlineStats } from '../types/agents';
import type { Client } from '../types/clients';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function SecretariaPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [sortBy, setSortBy] = useState<'urgency' | 'completed'>('urgency');
  const [activeDeadlines, setActiveDeadlines] = useState<Deadline[]>([]);
  const [completedDeadlines, setCompletedDeadlines] = useState<Deadline[]>([]);
  const [stats, setStats] = useState<DeadlineStats>({
    total: 0,
    overdue: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDeadlines, setIsLoadingDeadlines] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      loadDeadlines(selectedClientId);
    }
  }, [selectedClientId]);

  const loadClients = async () => {
    setIsLoading(true);
    const data = await getClients();
    setClients(data);
    if (data.length > 0) {
      setSelectedClientId(data[0].id);
    }
    setIsLoading(false);
  };

  const loadDeadlines = async (clientId: string) => {
    setIsLoadingDeadlines(true);
    try {
      // Fetch active deadlines
      const activeResponse = await fetch(
        `${API_BASE_URL}/api/clients/${clientId}/deadlines?completed=false`
      );
      const activeData = await activeResponse.json();
      setActiveDeadlines(activeData.deadlines || []);
      
      // Fetch completed deadlines
      const completedResponse = await fetch(
        `${API_BASE_URL}/api/clients/${clientId}/deadlines?completed=true`
      );
      const completedData = await completedResponse.json();
      setCompletedDeadlines(completedData.deadlines || []);
      
      // Fetch stats
      const statsData = await getClientDeadlineStats(clientId);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading deadlines:', error);
      // Reset to empty state on error
      setActiveDeadlines([]);
      setCompletedDeadlines([]);
      setStats({
        total: 0,
        overdue: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      });
    } finally {
      setIsLoadingDeadlines(false);
    }
  };

  const handleMarkComplete = async (deadlineId: string) => {
    if (!selectedClientId) return;
    
    try {
      await markDeadlineComplete(selectedClientId, deadlineId);
      
      // Refresh deadlines
      await loadDeadlines(selectedClientId);
      
      toast({
        title: "Tarea completada",
        description: "La tarea ha sido marcada como completada",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo marcar la tarea como completada",
        variant: "destructive",
      });
    }
  };

  const handleUndoComplete = async (deadlineId: string) => {
    if (!selectedClientId) return;
    
    try {
      await markDeadlineUncomplete(selectedClientId, deadlineId);
      
      // Refresh deadlines
      await loadDeadlines(selectedClientId);
      
      toast({
        title: "Tarea restaurada",
        description: "La tarea ha sido restaurada a la lista principal",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo restaurar la tarea",
        variant: "destructive",
      });
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'overdue':
        return 'bg-red-500';
      case 'critical':
        return 'bg-orange-500';
      case 'high':
        return 'bg-yellow-500';
      case 'medium':
        return 'bg-blue-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskLabel = (riskLevel: string) => {
    switch (riskLevel) {
      case 'overdue':
        return 'Vencido';
      case 'critical':
        return 'Crítico';
      case 'high':
        return 'Alto';
      case 'medium':
        return 'Medio';
      case 'low':
        return 'Bajo';
      default:
        return riskLevel;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Agente Secretaria</h1>
          </div>
          <p className="text-gray-600">
            Extracción inteligente de plazos y fechas críticas
          </p>
        </div>

        {/* Client Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Seleccionar Cliente
          </h2>
          {isLoading ? (
            <p className="text-black">Cargando clientes...</p>
          ) : clients.length === 0 ? (
            <p className="text-black">
              No hay clientes.  Ve a la página de Clientes para agregar uno.
            </p>
          ) : (
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full md:w-96 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg text-black"
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company ?  `- ${client.company}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 shadow border-2 border-red-200">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-red-800">Vencidos</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 shadow border-2 border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{stats.critical}</div>
            <div className="text-sm text-orange-800">Críticos</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 shadow border-2 border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{stats.high}</div>
            <div className="text-sm text-yellow-800">Altos</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 shadow border-2 border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.medium}</div>
            <div className="text-sm text-blue-800">Medios</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow border-2 border-green-200">
            <div className="text-2xl font-bold text-green-600">{stats.low}</div>
            <div className="text-sm text-green-800">Bajos</div>
          </div>
        </div>

        {/* Deadlines List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-black">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Plazos Detectados
            </h2>
            
            {selectedClientId && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ordenar por:</span>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'urgency' | 'completed')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgency">Por urgencia</SelectItem>
                    <SelectItem value="completed">Completados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {!selectedClientId ? (
            <p className="text-gray-500 text-center py-8">
              Seleccione un cliente para ver sus plazos.
            </p>
          ) : isLoadingDeadlines ? (
            <p className="text-gray-500 text-center py-8">
              Cargando plazos...
            </p>
          ) : sortBy === 'urgency' ? (
            activeDeadlines.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay plazos activos para este cliente. Suba documentos en la página de Clientes.
              </p>
            ) : (
              <div className="space-y-3">
                {activeDeadlines.map((deadline, idx) => (
                  <div key={deadline.id || idx} className="border-2 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      {/* Checkbox for completion */}
                      <Checkbox
                        checked={false}
                        onCheckedChange={() => handleMarkComplete(deadline.id || '')}
                        className="mt-1"
                      />
                      
                      {/* Risk indicator */}
                      <div className={`w-3 h-3 rounded-full ${getRiskBadgeColor(deadline.risk_level)} mt-1 flex-shrink-0`} />
                      
                      {/* Deadline content */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-black mb-2">{deadline.description}</h3>
                        <div className="flex items-center gap-3 text-sm text-black flex-wrap">
                          <span className="font-medium">{deadline.date}</span>
                          <span>
                            {deadline.working_days_remaining < 0
                              ? `Vencido hace ${Math.abs(deadline.working_days_remaining)} días`
                              : `${deadline.working_days_remaining} días hábiles`}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getRiskBadgeColor(deadline.risk_level)}`}>
                            {getRiskLabel(deadline.risk_level)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-3">
              {completedDeadlines.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay tareas completadas
                </p>
              ) : (
                completedDeadlines.map((deadline, idx) => (
                  <div key={deadline.id || idx} className="border-2 rounded-lg p-4 opacity-75 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      {/* Checkmark icon */}
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      
                      {/* Deadline content with strikethrough */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-base line-through text-black mb-2">
                          {deadline.description}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-black flex-wrap">
                          <span>{deadline.date}</span>
                          <span>Completado</span>
                        </div>
                      </div>
                      
                      {/* Undo button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUndoComplete(deadline.id || '')}
                        className="flex-shrink-0"
                      >
                        <Undo2 className="w-4 h-4 mr-1" />
                        Deshacer
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}