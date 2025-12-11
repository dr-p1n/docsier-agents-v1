import { useState, useEffect } from 'react';
import { Brain, Calendar } from 'lucide-react';
import { getUrgentDeadlines } from '../services/clients';
import type { Deadline } from '../types/agents';

export default function SmartContextPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUrgentDeadlines();
  }, []);

  const loadUrgentDeadlines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUrgentDeadlines(10);
      setDeadlines(data);
    } catch (err) {
      setError('Error al cargar tareas urgentes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'overdue': return 'bg-red-500 text-white';
      case 'critical': return 'bg-orange-500 text-white';
      case 'high': return 'bg-yellow-500 text-white';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRiskLabel = (risk: string) => {
    const labels: Record<string, string> = {
      overdue: 'Vencido',
      critical: 'Crítico',
      high: 'Alto',
      medium: 'Medio',
      low: 'Bajo'
    };
    return labels[risk] || risk;
  };

  const getRiskIndicatorColor = (risk: string) => {
    switch (risk) {
      case 'overdue': return 'bg-red-500';
      case 'critical': return 'bg-orange-500';
      case 'high': return 'bg-yellow-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-8 h-8 text-green-600" />
              <h1 className="text-4xl font-bold text-gray-900">Tareas Urgentes</h1>
            </div>
            <p className="text-gray-600">
              Las 10 tareas más urgentes de todos tus clientes
            </p>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-8 h-8 text-green-600" />
              <h1 className="text-4xl font-bold text-gray-900">Tareas Urgentes</h1>
            </div>
            <p className="text-gray-600">
              Las 10 tareas más urgentes de todos tus clientes
            </p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Tareas Urgentes</h1>
          </div>
          <p className="text-gray-600">
            Las 10 tareas más urgentes de todos tus clientes
          </p>
        </div>

        {/* Deadlines List */}
        {deadlines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay tareas urgentes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deadlines.map((deadline) => (
              <div 
                key={deadline.id || `${deadline.date}-${deadline.description}`}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Risk indicator dot */}
                  <div className={`w-3 h-3 rounded-full ${getRiskIndicatorColor(deadline.risk_level)} mt-1 flex-shrink-0`} />
                  
                  <div className="flex-1 min-w-0">
                    {/* Description */}
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">
                      {deadline.description}
                    </h3>
                    
                    {/* Client name */}
                    {deadline.client_name && (
                      <p className="text-sm text-gray-600 mb-2">
                        Cliente: {deadline.client_name}
                      </p>
                    )}
                    
                    {/* Timeframe */}
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{deadline.date}</span>
                      </div>
                      <span className="text-gray-600">
                        {deadline.working_days_remaining < 0
                          ? `Vencido hace ${Math.abs(deadline.working_days_remaining)} días`
                          : `${deadline.working_days_remaining} días hábiles`}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskBadgeColor(deadline.risk_level)}`}>
                        {getRiskLabel(deadline.risk_level)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}