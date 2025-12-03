import type { RiskLevel } from '../../types/agents';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

const getRiskConfig = (level: RiskLevel) => {
  switch (level) {
    case 'overdue':
      return {
        color: 'bg-red-500 text-white',
        label: 'VENCIDO',
      };
    case 'critical':
      return {
        color: 'bg-orange-500 text-white',
        label: 'CRÍTICO',
      };
    case 'high':
      return {
        color: 'bg-yellow-500 text-white',
        label: 'ALTO',
      };
    case 'medium':
      return {
        color: 'bg-blue-500 text-white',
        label: 'MEDIO',
      };
    case 'low':
      return {
        color: 'bg-green-500 text-white',
        label: 'BAJO',
      };
  }
};

const getSizeClass = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return 'text-xs px-2 py-0.5';
    case 'md':
      return 'text-sm px-3 py-1';
    case 'lg':
      return 'text-base px-4 py-2';
  }
};

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const config = getRiskConfig(level);
  const sizeClass = getSizeClass(size);

  return (
    <span className={`${config.color} ${sizeClass} rounded font-bold`}>
      {config.label}
    </span>
  );
}