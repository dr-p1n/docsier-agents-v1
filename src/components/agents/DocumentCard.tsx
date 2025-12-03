import { FileText, Tag, Users, Building2, Calendar, DollarSign } from 'lucide-react';
import type { DocumentClassificationResult } from '../../types/agents';

interface DocumentCardProps {
  document: DocumentClassificationResult;
}

const getDocTypeColor = (docType: string) => {
  switch (docType) {
    case 'contract':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'invoice':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'email':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'report':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'memo':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'legal':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getDocTypeLabel = (docType: string) => {
  const labels: Record<string, string> = {
    contract: 'Contrato',
    invoice: 'Factura',
    email: 'Email',
    report: 'Reporte',
    memo: 'Memo',
    legal: 'Legal',
    other: 'Otro',
  };
  return labels[docType] || docType;
};

export function DocumentCard({ document }: DocumentCardProps) {
  const { classification } = document;
  const docColor = getDocTypeColor(classification. doc_type);

  return (
    <div className={`border-2 rounded-lg p-4 ${docColor}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <span className="font-semibold text-sm">{document.filename}</span>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded bg-white/50">
          {getDocTypeLabel(classification.doc_type)}
        </span>
      </div>

      <p className="text-sm mb-3">{classification.summary}</p>

      {classification.matter_id && (
        <div className="text-xs mb-2">
          <strong>Asunto:</strong> {classification.matter_id}
        </div>
      )}

      {classification.tags.length > 0 && (
        <div className="flex items-center gap-1 mb-2 flex-wrap">
          <Tag className="w-3 h-3" />
          {classification.tags.map((tag, idx) => (
            <span key={idx} className="text-xs px-2 py-0.5 rounded bg-white/50">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs mt-3">
        {classification.key_entities.people.length > 0 && (
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{classification.key_entities.people. length} personas</span>
          </div>
        )}
        {classification.key_entities.organizations.length > 0 && (
          <div className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            <span>{classification.key_entities. organizations.length} orgs</span>
          </div>
        )}
        {classification.key_entities.dates.length > 0 && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{classification.key_entities.dates. length} fechas</span>
          </div>
        )}
        {classification.key_entities.amounts.length > 0 && (
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span>{classification.key_entities.amounts.length} montos</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-current/20">
        <span className="text-xs">
          Confianza: {(classification.confidence * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}