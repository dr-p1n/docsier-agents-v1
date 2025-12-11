import type { Client, ClientDocument } from '../types/clients';
import type {
  Deadline,
  DeadlineStats,
  DocumentClassificationResult,
  DocumentStats,
  StrategicAnalysis,
  RiskLevel,
  AnalysisType,
} from '../types/agents';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Default classification for documents without classification data
const DEFAULT_CLASSIFICATION: DocumentClassificationResult['classification'] = {
  doc_type: 'other',
  matter_id: null,
  tags: [],
  key_entities: { people: [], organizations: [], dates: [], amounts: [] },
  summary: '',
  confidence: 0,
};

// Type for backend document response
interface BackendDocument {
  id?: string;
  document_id?: string;
  filename: string;
  classification?: DocumentClassificationResult['classification'];
  created_at?: string;
}

// ============================================================================
// CLIENT MANAGEMENT API FUNCTIONS
// ============================================================================

export async function getClients(): Promise<Client[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients`);
    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

export async function getClient(clientId: string): Promise<Client | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch client: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
}

export async function createClient(
  clientData: Omit<Client, 'id' | 'created_at' | 'document_count'>
): Promise<Client> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create client: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

export async function updateClient(
  clientId: string,
  updates: Partial<Omit<Client, 'id' | 'created_at'>>
): Promise<Client> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(`Failed to update client: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}

export async function deleteClient(clientId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete client: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}

// ============================================================================
// DOCUMENT MANAGEMENT API FUNCTIONS
// ============================================================================

export async function getClientDocuments(clientId: string): Promise<ClientDocument[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}/documents`);
    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.status}`);
    }
    const data = await response.json();
    // Backend returns { client_id, count, documents } - extract documents array
    return data.documents || [];
  } catch (error) {
    console.error('Error fetching client documents:', error);
    throw error;
  }
}

export async function uploadClientDocument(
  clientId: string,
  file: File
): Promise<ClientDocument> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}/documents`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Failed to upload document: ${response.status}`);
    }
    const data = await response.json();
    // Transform backend response to match frontend ClientDocument interface
    // Backend returns: { success, filename, client_id, chunks_created, classification, deadlines_extracted, deadlines }
    return {
      id: data.document_id || `doc-${Date.now()}`,
      client_id: clientId,
      filename: data.filename,
      file_type: file.type,
      file_size: file.size,
      uploaded_at: new Date().toISOString(),
      processed: data.success,
      processing_status: data.success ? 'completed' : 'failed',
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}

export async function getClientDocumentStats(clientId: string): Promise<DocumentStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}/documents/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch document stats: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching document stats:', error);
    throw error;
  }
}

export async function deleteClientDocument(
  clientId: string,
  documentId: string
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/clients/${clientId}/documents/${documentId}`,
      {
        method: 'DELETE',
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to delete document: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

// ============================================================================
// DEADLINE API FUNCTIONS
// ============================================================================

export async function getClientDeadlines(
  clientId: string,
  riskLevel?: RiskLevel
): Promise<Deadline[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/clients/${clientId}/deadlines`);
    if (riskLevel) {
      url.searchParams.set('risk_level', riskLevel);
    }
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch deadlines: ${response.status}`);
    }
    const data = await response.json();
    // Backend returns { client_id, count, deadlines } - extract deadlines array
    return data.deadlines || [];
  } catch (error) {
    console.error('Error fetching client deadlines:', error);
    throw error;
  }
}

export async function getClientDeadlineStats(clientId: string): Promise<DeadlineStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}/deadlines/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch deadline stats: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching deadline stats:', error);
    throw error;
  }
}

export async function getUrgentDeadlines(limit: number = 10): Promise<Deadline[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/urgent-deadlines?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch urgent deadlines: ${response.status}`);
    }
    const data = await response.json();
    return data.deadlines || [];
  } catch (error) {
    console.error('Error fetching urgent deadlines:', error);
    throw error;
  }
}

export async function markDeadlineComplete(
  clientId: string,
  deadlineId: string
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/clients/${clientId}/deadlines/${deadlineId}/complete`,
      { method: 'PATCH' }
    );
    if (!response.ok) {
      throw new Error(`Failed to mark deadline complete: ${response.status}`);
    }
  } catch (error) {
    console.error('Error marking deadline complete:', error);
    throw error;
  }
}

export async function markDeadlineUncomplete(
  clientId: string,
  deadlineId: string
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/clients/${clientId}/deadlines/${deadlineId}/uncomplete`,
      { method: 'PATCH' }
    );
    if (!response.ok) {
      throw new Error(`Failed to restore deadline: ${response.status}`);
    }
  } catch (error) {
    console.error('Error restoring deadline:', error);
    throw error;
  }
}

// ============================================================================
// ANALYSIS API FUNCTIONS
// ============================================================================

export async function getClientAnalysis(
  clientId: string,
  analysisType?: AnalysisType
): Promise<StrategicAnalysis[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/clients/${clientId}/analysis`);
    if (analysisType) {
      url.searchParams.set('analysis_type', analysisType);
    }
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch analysis: ${response.status}`);
    }
    const data = await response.json();
    // Backend returns { client_id, count, analyses } - extract analyses array
    return data.analyses || [];
  } catch (error) {
    console.error('Error fetching client analysis:', error);
    throw error;
  }
}

// ============================================================================
// CLASSIFIED DOCUMENTS API FUNCTION
// ============================================================================

export async function getClientClassifiedDocuments(
  clientId: string
): Promise<DocumentClassificationResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}/documents`);
    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.status}`);
    }
    const data = await response.json();
    // Transform backend documents to DocumentClassificationResult format
    const documents: BackendDocument[] = data.documents || [];
    return documents.map((doc) => ({
      document_id: doc.id || doc.document_id,
      filename: doc.filename,
      classification: doc.classification || DEFAULT_CLASSIFICATION,
      created_at: doc.created_at,
    }));
  } catch (error) {
    console.error('Error fetching classified documents:', error);
    throw error;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}