// API service layer for backend agent integration
import type {
  DeadlineExtractionResult,
  DeadlineStats,
  DocumentClassificationResult,
  DocumentStats,
  StrategicAnalysis,
  AnalysisType,
} from '../types/agents';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ============================================================================
// DEADLINE AGENT API
// ============================================================================

export async function extractDeadlines(text: string): Promise<DeadlineExtractionResult> {
  const response = await fetch(`${API_BASE_URL}/deadlines/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  
  if (! response.ok) throw new Error('Failed to extract deadlines');
  return response.json();
}

export async function getDeadlineStats(): Promise<DeadlineStats> {
  const response = await fetch(`${API_BASE_URL}/deadlines/stats`);
  
  if (!response.ok) throw new Error('Failed to fetch deadline stats');
  return response.json();
}

// ============================================================================
// DOCUMENT AGENT API
// ============================================================================

export async function classifyDocument(file: File): Promise<DocumentClassificationResult> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/documents/classify`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) throw new Error('Failed to classify document');
  return response.json();
}

export async function getDocumentStats(): Promise<DocumentStats> {
  const response = await fetch(`${API_BASE_URL}/documents/stats`);
  
  if (!response.ok) throw new Error('Failed to fetch document stats');
  return response.json();
}

// ============================================================================
// SMARTCONTEXT AGENT API
// ============================================================================

export async function runStrategicAnalysis(
  firmId: string,
  analysisType: AnalysisType
): Promise<StrategicAnalysis> {
  const response = await fetch(`${API_BASE_URL}/analysis/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firm_id: firmId, analysis_type: analysisType }),
  });
  
  if (!response. ok) throw new Error('Failed to run strategic analysis');
  return response.json();
}

// ============================================================================
// MOCK DATA (for development/testing)
// ============================================================================

export const MOCK_DEADLINE_STATS: DeadlineStats = {
  total: 24,
  overdue: 2,
  critical: 5,
  high: 8,
  medium: 6,
  low: 3,
};

export const MOCK_DOCUMENT_STATS: DocumentStats = {
  total: 156,
  contract: 45,
  invoice: 32,
  email: 28,
  report: 22,
  memo: 18,
  legal: 8,
  other: 3,
};

export const MOCK_DEADLINES: DeadlineExtractionResult = {
  extraction_id: 'mock-001',
  count: 5,
  deadlines: [
    {
      date: '2025-12-05',
      description: 'Presentación de alegatos en caso Martínez vs. López',
      working_days_remaining: 2,
      risk_level: 'critical',
      source_id: 'doc-001',
    },
    {
      date: '2025-12-10',
      description: 'Vencimiento póliza de seguros empresa ClienteCorp',
      working_days_remaining: 7,
      risk_level: 'high',
      source_id: 'doc-002',
    },
    {
      date: '2025-12-15',
      description: 'Audiencia preliminar caso penal Rodríguez',
      working_days_remaining: 12,
      risk_level: 'medium',
      source_id: 'doc-003',
    },
    {
      date: '2025-12-01',
      description: 'Pago de impuestos trimestrales',
      working_days_remaining: -2,
      risk_level: 'overdue',
      source_id: 'doc-004',
    },
    {
      date: '2025-12-25',
      description: 'Renovación de contratos laborales',
      working_days_remaining: 22,
      risk_level: 'low',
      source_id: 'doc-005',
    },
  ],
};

export const MOCK_DOCUMENTS: DocumentClassificationResult[] = [
  {
    document_id: 'doc-001',
    filename: 'contrato_servicios_2025.pdf',
    classification: {
      doc_type: 'contract',
      matter_id: 'MAT-2025-001',
      tags: ['servicios', 'anual', 'renovable'],
      key_entities: {
        people: ['Juan Pérez', 'María García'],
        organizations: ['TechCorp S.A.', 'Bufete Legal Asociados'],
        dates: ['2025-01-15', '2025-12-31'],
        amounts: ['$50,000 USD'],
      },
      summary: 'Contrato de prestación de servicios legales anuales con opción de renovación automática.',
      confidence: 0.95,
    },
    created_at: '2025-12-01T10:30:00Z',
  },
  {
    document_id: 'doc-002',
    filename: 'factura_nov_2025.pdf',
    classification: {
      doc_type: 'invoice',
      matter_id: null,
      tags: ['mensual', 'pagada'],
      key_entities: {
        people: [],
        organizations: ['Proveedor XYZ'],
        dates: ['2025-11-30'],
        amounts: ['$2,500 USD'],
      },
      summary: 'Factura mensual de servicios de oficina y suministros.',
      confidence: 0.98,
    },
    created_at: '2025-11-30T15:45:00Z',
  },
  {
    document_id: 'doc-003',
    filename: 'email_cliente_urgente.eml',
    classification: {
      doc_type: 'email',
      matter_id: 'MAT-2025-089',
      tags: ['urgente', 'seguimiento'],
      key_entities: {
        people: ['Roberto Sánchez'],
        organizations: ['Inmobiliaria del Sur'],
        dates: ['2025-12-03'],
        amounts: [],
      },
      summary: 'Correo del cliente solicitando actualización urgente sobre proceso de compraventa.',
      confidence: 0.92,
    },
    created_at: '2025-12-03T09:15:00Z',
  },
];

export const MOCK_STRATEGIC_ANALYSIS: StrategicAnalysis = {
  analysis_id: 'analysis-001',
  firm_id: 'firm-demo',
  analysis_type: 'deadline_risk',
  result: {
    key_insights: [
      '2 plazos vencidos requieren atención inmediata',
      '5 plazos críticos en los próximos 3 días hábiles',
      'Tasa de cumplimiento del 92% en el último mes',
      'Área de litigios presenta mayor concentración de riesgos',
    ],
    action_items: [
      'Priorizar caso Martínez vs. López (vence en 2 días)',
      'Asignar recursos adicionales a área de litigios',
      'Implementar alertas tempranas para plazos críticos',
      'Revisar proceso de seguimiento de plazos vencidos',
    ],
    metrics: {
      overdue_percentage: 8. 3,
      critical_percentage: 20. 8,
      average_response_time: 2.5,
      compliance_rate: 91.7,
    },
    summary: 'Análisis de riesgo de plazos identifica 2 casos vencidos y 5 críticos que requieren acción inmediata.  La tasa de cumplimiento general es buena (92%) pero el área de litigios necesita refuerzo.',
    risk_level: 'high',
    confidence: 0.89,
  },
  created_at: '2025-12-03T14:00:00Z',
};