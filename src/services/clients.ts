import type { Client, ClientDocument } from '../types/clients';

// Mock clients data
export const MOCK_CLIENTS: Client[] = [
  {
    id: 'client-001',
    name: 'Juan Pérez',
    email: 'juan. perez@email.com',
    phone: '+56 9 1234 5678',
    company: 'TechCorp S.A.',
    created_at: '2025-01-15T10:00:00Z',
    document_count: 12,
    active: true,
  },
  {
    id: 'client-002',
    name: 'María García',
    email: 'maria.garcia@email.com',
    phone: '+56 9 8765 4321',
    company: 'Inmobiliaria del Sur',
    created_at: '2025-02-20T14:30:00Z',
    document_count: 8,
    active: true,
  },
  {
    id: 'client-003',
    name: 'Roberto Sánchez',
    email: 'roberto.sanchez@email.com',
    phone: '+56 9 5555 1234',
    company: null,
    created_at: '2025-03-10T09:15:00Z',
    document_count: 5,
    active: true,
  },
];

export const MOCK_CLIENT_DOCUMENTS: Record<string, ClientDocument[]> = {
  'client-001': [
    {
      id: 'doc-001',
      client_id: 'client-001',
      filename: 'contrato_servicios_2025.pdf',
      file_type: 'application/pdf',
      file_size: 2048576,
      uploaded_at: '2025-12-01T10:30:00Z',
      processed: true,
      processing_status: 'completed',
    },
    {
      id: 'doc-002',
      client_id: 'client-001',
      filename: 'factura_nov_2025.pdf',
      file_type: 'application/pdf',
      file_size: 512000,
      uploaded_at: '2025-11-30T15:45:00Z',
      processed: true,
      processing_status: 'completed',
    },
  ],
  'client-002': [
    {
      id: 'doc-003',
      client_id: 'client-002',
      filename: 'email_cliente_urgente.eml',
      file_type: 'message/rfc822',
      file_size: 45000,
      uploaded_at: '2025-12-03T09:15:00Z',
      processed: true,
      processing_status: 'completed',
    },
  ],
  'client-003': [],
};

// API functions (mock for now, will connect to backend later)
export async function getClients(): Promise<Client[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_CLIENTS), 500);
  });
}

export async function getClient(clientId: string): Promise<Client | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const client = MOCK_CLIENTS.find((c) => c.id === clientId);
      resolve(client || null);
    }, 300);
  });
}

export async function createClient(clientData: Omit<Client, 'id' | 'created_at' | 'document_count'>): Promise<Client> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newClient: Client = {
        ... clientData,
        id: `client-${Date.now()}`,
        created_at: new Date().toISOString(),
        document_count: 0,
      };
      resolve(newClient);
    }, 500);
  });
}

export async function getClientDocuments(clientId: string): Promise<ClientDocument[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CLIENT_DOCUMENTS[clientId] || []);
    }, 300);
  });
}

export async function uploadClientDocument(clientId: string, file: File): Promise<ClientDocument> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDoc: ClientDocument = {
        id: `doc-${Date. now()}`,
        client_id: clientId,
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        uploaded_at: new Date().toISOString(),
        processed: false,
        processing_status: 'pending',
      };
      resolve(newDoc);
    }, 1000);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}