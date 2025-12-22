import { useState, useEffect } from 'react';
import { FileText, BarChart3, Users } from 'lucide-react';
import { DocumentCard, ValidationIndicator } from '../components/agents';
import { getClients, getClientClassifiedDocuments, getClientDocumentStats, API_BASE_URL } from '../services/clients';
import type { DocumentStats } from '../types/agents';
import type { Client } from '../types/clients';
import type { DocumentWithValidation } from '@/types/validation';

export default function ArchivistaPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [documents, setDocuments] = useState<DocumentWithValidation[]>([]);
  const [stats, setStats] = useState<DocumentStats>({
    total: 0,
    contract: 0,
    invoice: 0,
    email: 0,
    report: 0,
    memo: 0,
    legal: 0,
    other: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      loadDocuments(selectedClientId);
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

  const loadDocuments = async (clientId: string) => {
    setIsLoadingDocuments(true);
    try {
      const [documentsData, statsData] = await Promise.all([
        getClientClassifiedDocuments(clientId),
        getClientDocumentStats(clientId),
      ]);
      
      // Fetch validations for each document
      const documentsWithValidation = await Promise.all(
        documentsData.map(async (doc) => {
          try {
            const validationRes = await fetch(
              `${API_BASE_URL}/api/validations/classification/${doc.document_id}`
            );
            if (validationRes.ok) {
              const validationData = await validationRes.json();
              // Extract the nested validation object
              return { ...doc, validation: validationData.validation };
            }
          } catch (error) {
            console.warn(`Could not fetch validation for document ${doc.document_id}:`, error);
          }
          // Return document with null validation if fetch failed
          return { ...doc, validation: null };
        })
      );
      
      setDocuments(documentsWithValidation);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading documents:', error);
      // Reset to empty state on error
      setDocuments([]);
      setStats({
        total: 0,
        contract: 0,
        invoice: 0,
        email: 0,
        report: 0,
        memo: 0,
        legal: 0,
        other: 0,
      });
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Agente Archivista</h1>
          </div>
          <p className="text-gray-600">
            Clasificación automática de documentos con extracción de entidades
          </p>
        </div>

        {/* Client Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
            <Users className="w-5 h-5 text-purple-600" />
            Seleccionar Cliente
          </h2>
          {isLoading ?  (
            <p className="text-black">Cargando clientes...</p>
          ) : clients.length === 0 ? (
            <p className="text-black">
              No hay clientes. Ve a la página de Clientes para agregar uno.
            </p>
          ) : (
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full md:w-96 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg text-black"
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company ? `- ${client.company}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 shadow border-2 border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{stats.contract}</div>
            <div className="text-xs text-purple-800">Contratos</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow border-2 border-green-200">
            <div className="text-2xl font-bold text-green-600">{stats.invoice}</div>
            <div className="text-xs text-green-800">Facturas</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 shadow border-2 border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.email}</div>
            <div className="text-xs text-blue-800">Emails</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 shadow border-2 border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{stats.report}</div>
            <div className="text-xs text-orange-800">Reportes</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 shadow border-2 border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{stats.memo}</div>
            <div className="text-xs text-yellow-800">Memos</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 shadow border-2 border-red-200">
            <div className="text-2xl font-bold text-red-600">{stats.legal}</div>
            <div className="text-xs text-red-800">Legales</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow border-2 border-gray-200">
            <div className="text-2xl font-bold text-gray-600">{stats.other}</div>
            <div className="text-xs text-gray-800">Otros</div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Documentos Clasificados ({documents.length})
          </h2>
          
          {!selectedClientId ? (
            <p className="text-gray-500 text-center py-8">
              Seleccione un cliente para ver sus documentos.
            </p>
          ) : isLoadingDocuments ? (
            <p className="text-gray-500 text-center py-8">
              Cargando documentos...
            </p>
          ) : documents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay documentos para este cliente. Suba documentos en la página de Clientes.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div key={doc.document_id}>
                  <DocumentCard document={doc} />
                  {doc.validation && (
                    <ValidationIndicator validation={doc.validation} compact />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}