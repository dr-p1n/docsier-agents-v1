import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Calendar, FileText, Brain, Home, User, LogOut } from 'lucide-react';
import SecretariaPage from './pages/SecretariaPage';
import ArchivistaPage from './pages/ArchivistaPage';
import SmartContextPage from './pages/SmartContextPage';
import SettingsPage from './pages/SettingsPage';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Docsier AI Agents</h1>
          <p className="text-xl text-gray-600 mb-2">
            Sistema integrado de agentes inteligentes para gestión legal
          </p>
          {user && (
            <p className="text-lg text-indigo-600 font-semibold">
              Bienvenido, {user.name}!
            </p>
          )}
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

function Navigation() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Home className="w-6 h-6" />
            Docsier AI
          </Link>
          <div className="flex gap-4 items-center">
            <Link
              to="/secretaria"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Deadlines
            </Link>
            <Link
              to="/archivista"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Gestión de Documentos
            </Link>
            <Link
              to="/smartcontext"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors"
            >
              <Brain className="w-5 h-5" />
              Contexto Inteligente
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <User className="w-5 h-5" />
              Clientes
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <Navigation />

          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/secretaria"
              element={
                <ProtectedRoute>
                  <SecretariaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/archivista"
              element={
                <ProtectedRoute>
                  <ArchivistaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/smartcontext"
              element={
                <ProtectedRoute>
                  <SmartContextPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Routes>

          <Toaster />
          <Sonner />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;