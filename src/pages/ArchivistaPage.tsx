import { useState } from 'react';
import { FileText, Upload, BarChart3 } from 'lucide-react';
import { DocumentCard } from '../components/agents';
import { MOCK_DOCUMENTS, MOCK_DOCUMENT_STATS } from '../services/api';
import type { DocumentClassificationResult } from '../types/agents';

export default function ArchivistaPage() {
  const [documents, setDocuments] = useState<DocumentClassificationResult[]>(MOCK_DOCUMENTS);
  const [isUploading, setIsUploading] = useState(false);

  const stats = MOCK_DOCUMENT_STATS;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate API call - replace with real API call later
    setTimeout(() => {
      setIsUploading(false);
      // For now, just show mock data
      setDocuments(MOCK_DOCUMENTS);
    }, 2000);
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

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-purple-600" />
            Subir y Clasificar Documento
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt,. eml"
              className="hidden"
              disabled={isUploading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-12 h-12 text-gray-400" />
              <span className="text-lg font-medium text-gray-700">
                {isUploading ? 'Clasificando documento...' : 'Click para subir documento'}
              </span>
              <span className="text-sm text-gray-500">
                PDF, DOC, DOCX, TXT, EML
              </span>
            </label>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Documentos Clasificados ({documents.length})
          </h2>
          
          {documents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay documentos clasificados. Suba un documento para comenzar.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <DocumentCard key={doc. document_id} document={doc} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}