import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Calendar, FileText, Brain, Home } from 'lucide-react';
import SecretariaPage from './pages/SecretariaPage';
import ArchivistaPage from './pages/ArchivistaPage';
import SmartContextPage from './pages/SmartContextPage';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Docsier AI Agents</h1>
          <p className="text-xl text-gray-600">
            Sistema integrado de agentes inteligentes para gestión legal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Secretaria Agent */}
          <Link
            to="/secretaria"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-indigo-500"
          >
            <Calendar className="w-16 h-16 text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Agente Secretaria</h2>
            <p className="text-gray-600">
              Extracción inteligente de plazos y fechas críticas con clasificación de riesgo
            </p>
          </Link>

          {/* Archivista Agent */}
          <Link
            to="/archivista"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-purple-500"
          >
            <FileText className="w-16 h-16 text-purple-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Agente Archivista</h2>
            <p className="text-gray-600">
              Clasificación automática de documentos con extracción de entidades clave
            </p>
          </Link>

          {/* SmartContext Agent */}
          <Link
            to="/smartcontext"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-green-500"
          >
            <Brain className="w-16 h-16 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">SmartContext Agent</h2>
            <p className="text-gray-600">
              Análisis estratégico inteligente con recomendaciones accionables
            </p>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6 inline-block">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🚀 Backend RAG MCP Server Integration
            </h3>
            <p className="text-sm text-gray-600">
              Powered by Claude AI + MCP Architecture
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Home className="w-6 h-6" />
                Docsier AI
              </Link>
              <div className="flex gap-4">
                <Link
                  to="/secretaria"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  Secretaria
                </Link>
                <Link
                  to="/archivista"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  Archivista
                </Link>
                <Link
                  to="/smartcontext"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <Brain className="w-5 h-5" />
                  SmartContext
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/secretaria" element={<SecretariaPage />} />
          <Route path="/archivista" element={<ArchivistaPage />} />
          <Route path="/smartcontext" element={<SmartContextPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;