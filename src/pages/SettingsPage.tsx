import { useState, useEffect } from 'react';
import { Settings, Users, Plus, Upload, FileText, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import type { Client, ClientDocument } from '../types/clients';
import { getClients, createClient, getClientDocuments, uploadClientDocument, formatFileSize } from '../services/clients';

export default function SettingsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientDocuments, setClientDocuments] = useState<ClientDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    active: true,
  });

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      loadClientDocuments(selectedClient.id);
    }
  }, [selectedClient]);

  const loadClients = async () => {
    setIsLoading(true);
    const data = await getClients();
    setClients(data);
    if (data.length > 0 && ! selectedClient) {
      setSelectedClient(data[0]);
    }
    setIsLoading(false);
  };

  const loadClientDocuments = async (clientId: string) => {
    const docs = await getClientDocuments(clientId);
    setClientDocuments(docs);
  };

  const handleAddClient = async () => {
    if (!newClientForm.name || !newClientForm.email) {
      alert('Nombre y email son requeridos');
      return;
    }

    const newClient = await createClient(newClientForm);
    setClients([...clients, newClient]);
    setSelectedClient(newClient);
    setShowAddClient(false);
    setNewClientForm({ name: '', email: '', phone: '', company: '', active: true });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (! selectedClient) return;
    
    const file = event. target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const newDoc = await uploadClientDocument(selectedClient.id, file);
    setClientDocuments([newDoc, ...clientDocuments]);
    setIsUploading(false);
    
    // Reset input
    event.target.value = '';
  };

  const getStatusIcon = (status: ClientDocument['processing_status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: ClientDocument['processing_status']) => {
    switch (status) {
      case 'completed':
        return 'Procesado';
      case 'processing':
        return 'Procesando... ';
      case 'failed':
        return 'Error';
      default:
        return 'Pendiente';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-gray-700" />
            <h1 className="text-4xl font-bold text-black">Gestión de Clientes</h1>
          </div>
          <p className="text-gray-600">
            Administre clientes y sus documentos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clients List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-black">
                <Users className="w-5 h-5 text-gray-700" />
                Clientes ({clients.length})
              </h2>
              <button
                onClick={() => setShowAddClient(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <p className="text-black text-center py-4">Cargando... </p>
            ) : clients.length === 0 ? (
              <p className="text-black text-center py-4">No hay clientes</p>
            ) : (
              <div className="space-y-2">
                {clients.map((client) => (
                  <button
                    key={client. id}
                    onClick={() => setSelectedClient(client)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedClient?.id === client.id
                        ?  'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold text-black">{client.name}</div>
                    {client.company && (
                      <div className="text-sm text-black">{client.company}</div>
                    )}
                    <div className="text-xs text-black mt-1">
                      {client. document_count} documentos
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Client Details & Documents */}
          <div className="lg:col-span-2 space-y-6">
            {selectedClient ?  (
              <>
                {/* Client Info */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 text-black">Información del Cliente</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-black">Nombre</div>
                      <div className="font-semibold text-black">{selectedClient.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-black">Email</div>
                      <div className="font-semibold text-black">{selectedClient.email}</div>
                    </div>
                    {selectedClient.phone && (
                      <div>
                        <div className="text-sm text-black">Teléfono</div>
                        <div className="font-semibold text-black">{selectedClient.phone}</div>
                      </div>
                    )}
                    {selectedClient.company && (
                      <div>
                        <div className="text-sm text-black">Empresa</div>
                        <div className="font-semibold text-black">{selectedClient.company}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Upload */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
                    <Upload className="w-5 h-5 text-gray-700" />
                    Subir Documentos
                  </h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id="client-doc-upload"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.txt,. eml"
                      className="hidden"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="client-doc-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-12 h-12 text-gray-400" />
                      <span className="text-lg font-medium text-black">
                        {isUploading ? 'Subiendo...' : 'Click para subir documento'}
                      </span>
                      <span className="text-sm text-black">
                        PDF, DOC, DOCX, TXT, EML
                      </span>
                    </label>
                  </div>
                </div>

                {/* Documents List */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
                    <FileText className="w-5 h-5 text-gray-700" />
                    Documentos ({clientDocuments.length})
                  </h2>
                  {clientDocuments.length === 0 ? (
                    <p className="text-black text-center py-8">
                      No hay documentos para este cliente
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {clientDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <FileText className="w-5 h-5 text-gray-600 mt-1" />
                              <div className="flex-1">
                                <div className="font-semibold text-black">{doc.filename}</div>
                                <div className="text-sm text-black mt-1">
                                  {formatFileSize(doc.file_size)} • {new Date(doc.uploaded_at). toLocaleDateString('es-CL')}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(doc.processing_status)}
                              <span className="text-sm text-black">
                                {getStatusText(doc.processing_status)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-black text-lg">
                  Seleccione un cliente para ver sus detalles y documentos
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-black">Agregar Nuevo Cliente</h3>
              <button
                onClick={() => setShowAddClient(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={newClientForm.name}
                  onChange={(e) => setNewClientForm({ ...newClientForm, name: e.target.value })}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newClientForm.email}
                  onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target. value })}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="juan@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={newClientForm. phone}
                  onChange={(e) => setNewClientForm({ ... newClientForm, phone: e. target.value })}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="+56 9 1234 5678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Empresa
                </label>
                <input
                  type="text"
                  value={newClientForm.company}
                  onChange={(e) => setNewClientForm({ ...newClientForm, company: e.target.value })}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="TechCorp S.A."
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddClient(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddClient}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}