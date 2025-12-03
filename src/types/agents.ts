// Type definitions matching the RAG MCP Server backend agents

// ============================================================================
// DEADLINE AGENT TYPES
// ============================================================================

export type RiskLevel = 'overdue' | 'critical' | 'high' | 'medium' | 'low';

export interface Deadline {
  date: string; // YYYY-MM-DD format
  description: string;
  working_days_remaining: number;
  risk_level: RiskLevel;
  source_id?: string;
}

export interface DeadlineExtractionResult {
  extraction_id: string;
  deadlines: Deadline[];
  count: number;
}

export interface DeadlineStats {
  total: number;
  overdue: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

// ============================================================================
// DOCUMENT AGENT TYPES
// ============================================================================

export type DocumentType = 'contract' | 'invoice' | 'email' | 'report' | 'memo' | 'legal' | 'other';

export interface KeyEntities {
  people: string[];
  organizations: string[];
  dates: string[];
  amounts: string[];
}

export interface DocumentClassification {
  doc_type: DocumentType;
  matter_id: string | null;
  tags: string[];
  key_entities: KeyEntities;
  summary: string;
  confidence: number; // 0-1
}

export interface DocumentClassificationResult {
  document_id: string;
  filename: string;
  classification: DocumentClassification;
  created_at?: string;
}

export interface DocumentStats {
  total: number;
  contract: number;
  invoice: number;
  email: number;
  report: number;
  memo: number;
  legal: number;
  other: number;
}

// ============================================================================
// SMARTCONTEXT AGENT TYPES
// ============================================================================

export type AnalysisType = 'deadline_risk' | 'caseload_health' | 'profitability_trends';

export interface AnalysisResult {
  key_insights: string[];
  action_items: string[];
  metrics: Record<string, number>;
  summary: string;
  risk_level: RiskLevel;
  confidence: number; // 0-1
}

export interface StrategicAnalysis {
  analysis_id: string;
  firm_id: string;
  analysis_type: AnalysisType;
  result: AnalysisResult;
  created_at: string;
}