import { CheckCircle, AlertCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { ValidationResult } from '@/types/validation';

interface ValidationIndicatorProps {
  validation: ValidationResult | null | undefined;
  compact?: boolean;
}

export function ValidationIndicator({ validation, compact = false }: ValidationIndicatorProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Add safety check for validation object
  if (!validation) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 mt-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">Validación no disponible</span>
        </div>
      </div>
    );
  }
  
  const statusConfig = {
    validated: { 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      border: 'border-green-200'
    },
    warning: { 
      icon: AlertCircle, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50',
      border: 'border-yellow-200'
    },
    error: { 
      icon: XCircle, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      border: 'border-red-200'
    },
  };
  
  // Default to 'warning' if status is not recognized
  const status = validation.validation_status in statusConfig 
    ? validation.validation_status 
    : 'warning';
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-2 mt-2`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left"
      >
        <Icon className={`w-4 h-4 ${config.color}`} />
        <span className={`text-xs font-medium ${config.color}`}>
          {Math.round((validation?.confidence_score ?? 0) * 100)}% Verificado
        </span>
        {!compact && (
          <span className="ml-auto">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        )}
      </button>
      
      {expanded && !compact && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-700 mb-2">{validation.feedback}</p>
          
          {validation.verified_items && validation.verified_items.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-700 mb-1">✓ Verificado:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {validation.verified_items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {validation.discrepancies && validation.discrepancies.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">⚠ Discrepancias:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {validation.discrepancies.map((disc, i) => (
                  <li key={i}>• {disc.claim || disc.reality || disc.field || 'Discrepancia desconocida'}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
