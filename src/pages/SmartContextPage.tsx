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
      setError('Error al cargar documentos pendientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const riskConfig = {
    overdue: { bg: 'bg-red-500', label: 'Vencido' },
    critical: { bg: 'bg-orange-500', label: 'Crítico' },
    high: { bg: 'bg-yellow-500', label: 'Alto' },
    medium: { bg: 'bg-blue-500', label: 'Medio' },
    low: { bg: 'bg-green-500', label: 'Bajo' },
  };

  const getRiskConfig = (risk: string) => {
    return riskConfig[risk as keyof typeof riskConfig] || { bg: 'bg-gray-500', label: risk };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-8 h-8 text-green-600" />
              <h1 className="text-4xl font-bold text-gray-900">Documentos Pendientes</h1>
            </div>
            <p className="text-gray-600">
              Relaciones de documentos y procesos pendientes entre y de clientes
            </p>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-4 animate-pulse">
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
              <h1 className="text-4xl font-bold text-gray-900">Documentos Pendientes</h1>
            </div>
            <p className="text-gray-600">
              Relaciones de documentos y procesos pendientes entre y de clientes
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
            <h1 className="text-4xl font-bold text-gray-900">Documentos Pendientes</h1>
          </div>
          <p className="text-gray-600">
            Relaciones de documentos y procesos pendientes entre y de clientes
          </p>
        </div>

        {/* Deadlines List */}
        {deadlines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay documentos pendientes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {deadlines.map((deadline, index) => {
              const riskInfo = getRiskConfig(deadline.risk_level);
              return (
                <div 
                  key={deadline.id || `deadline-${index}`}
                  className="bg-white rounded-xl shadow-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    {/* Risk indicator dot */}
                    <div className={`w-2.5 h-2.5 rounded-full ${riskInfo.bg} mt-1 flex-shrink-0`} />
                    
                    <div className="flex-1 min-w-0">
                      {/* Description */}
                      <h3 className="font-semibold text-base mb-1 text-gray-900">
                        {deadline.description}
                      </h3>
                      
                      {/* Client name */}
                      {deadline.client_name && (
                        <p className="text-xs text-gray-600 mb-1">
                          Cliente: {deadline.client_name}
                        </p>
                      )}
                      
                      {/* Timeframe */}
                      <div className="flex items-center gap-3 text-xs flex-wrap">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{deadline.date}</span>
                        </div>
                        <span className="text-gray-600">
                          {deadline.working_days_remaining < 0
                            ? `Vencido hace ${Math.abs(deadline.working_days_remaining)} días`
                            : `${deadline.working_days_remaining} días hábiles`}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${riskInfo.bg}`}>
                          {riskInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}