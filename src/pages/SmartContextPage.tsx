import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, Users } from 'lucide-react';
import { getClients, getClientAnalysis } from '../services/clients';
import type { Client } from '../types/clients';
import { RiskBadge } from '../components/agents';
import type { StrategicAnalysis, AnalysisType } from '../types/agents';

export default function SmartContextPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [analysis, setAnalysis] = useState<StrategicAnalysis | null>(null);
  const [selectedType, setSelectedType] = useState<AnalysisType>('deadline_risk');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      loadAnalysis(selectedClientId, selectedType);
    }
  }, [selectedClientId, selectedType]);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const data = await getClients();
      setClients(data);
      if (data.length > 0) {
        setSelectedClientId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalysis = async (clientId: string, analysisType?: AnalysisType) => {
    try {
      const analyses = await getClientAnalysis(clientId, analysisType);
      // Use the first analysis result if available
      setAnalysis(analyses.length > 0 ? analyses[0] : null);
    } catch (error) {
      console.error('Error loading analysis:', error);
      setAnalysis(null);
    }
  };

  const analysisTypes: { value: AnalysisType; label: string; description: string }[] = [
    {
      value: 'deadline_risk',
      label: 'Análisis de Riesgo de Plazos',
      description: 'Evalúa el estado de plazos y fechas críticas',
    },
    {
      value: 'caseload_health',
      label: 'Salud de Cartera de Casos',
      description: 'Analiza la distribución y estado de casos activos',
    },
    {
      value: 'profitability_trends',
      label: 'Tendencias de Rentabilidad',
      description: 'Identifica patrones en facturación y cobros',
    },
  ];

  const handleRunAnalysis = async () => {
    if (!selectedClientId) return;
    setIsAnalyzing(true);
    try {
      await loadAnalysis(selectedClientId, selectedType);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">SmartContext Agent</h1>
          </div>
          <p className="text-gray-600">
            Análisis estratégico inteligente con recomendaciones accionables
          </p>
        </div>
        {/* Client Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Seleccionar Cliente
          </h2>
          {isLoading ?  (
            <p className="text-gray-500">Cargando clientes...</p>
          ) : clients.length === 0 ? (
            <p className="text-gray-500">
              No hay clientes. Ve a la página de Clientes para agregar uno.
            </p>
          ) : (
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full md:w-96 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company ? `- ${client.company}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Analysis Type Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Seleccionar Tipo de Análisis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {analysisTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type. value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedType === type.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1">{type.label}</div>
                <div className="text-sm text-gray-600">{type.description}</div>
              </button>
            ))}
          </div>
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? 'Analizando...' : 'Ejecutar Análisis'}
          </button>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-green-600" />
                  Resumen Ejecutivo
                </h2>
                <RiskBadge level={analysis.result.risk_level} />
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">{analysis.result.summary}</p>
              <div className="text-sm text-gray-500">
                Confianza del análisis: {(analysis.result.confidence * 100).toFixed(0)}%
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Métricas Clave
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analysis.result.metrics).map(([key, value]) => (
                  <div key={key} className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      {typeof value === 'number' ? value.toFixed(1) : value}
                      {key.includes('percentage') || key.includes('rate') ? '%' : ''}
                    </div>
                    <div className="text-xs text-green-800 mt-1">
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-green-600" />
                Insights Clave
              </h2>
              <div className="space-y-3">
                {analysis.result.key_insights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-800">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Items */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Acciones Recomendadas
              </h2>
              <div className="space-y-3">
                {analysis.result.action_items. map((action, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-gray-800">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}