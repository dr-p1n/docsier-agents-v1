import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Users } from 'lucide-react';
import { DeadlineCard } from '../components/agents';
import { MOCK_DEADLINES, MOCK_DEADLINE_STATS } from '../services/api';
import { getClients } from '../services/clients';
import type { DeadlineExtractionResult } from '../types/agents';
import type { Client } from '../types/clients';

export default function SecretariaPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [deadlines, setDeadlines] = useState<DeadlineExtractionResult>(MOCK_DEADLINES);
  const [isLoading, setIsLoading] = useState(true);

  const stats = MOCK_DEADLINE_STATS;

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
    // TODO: Replace with real API call filtered by client
    // For now, showing mock data
    setDeadlines(MOCK_DEADLINES);
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
            <p className="text-gray-500">Cargando clientes...</p>
          ) : clients.length === 0 ? (
            <p className="text-gray-500">
              No hay clientes.  Ve a la página de Clientes para agregar uno.
            </p>
          ) : (
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target. value)}
              className="w-full md:w-96 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
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
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Plazos Detectados ({deadlines.count})
          </h2>
          
          {! selectedClientId ? (
            <p className="text-gray-500 text-center py-8">
              Seleccione un cliente para ver sus plazos. 
            </p>
          ) : deadlines.deadlines.length === 0 ?  (
            <p className="text-gray-500 text-center py-8">
              No hay plazos para este cliente.  Suba documentos en la página de Clientes. 
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deadlines.deadlines.map((deadline, idx) => (
                <DeadlineCard key={idx} deadline={deadline} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}