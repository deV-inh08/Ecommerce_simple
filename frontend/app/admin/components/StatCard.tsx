import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: number; // positive or negative percentage
  trendLabel?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
}: StatCardProps) {
  const isTrendUp = trend && trend > 0;

  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        backgroundColor: '#ffffff',
        borderColor: 'var(--border)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {title}
          </p>
          <h3
            className="text-3xl font-bold mt-2 font-heading"
            style={{ color: 'var(--text-dark)' }}
          >
            {value}
          </h3>

          {trend !== undefined && (
            <div className="flex items-center gap-2 mt-3">
              <div
                className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: isTrendUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: isTrendUp ? '#10b981' : 'var(--red)',
                }}
              >
                {isTrendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{Math.abs(trend)}%</span>
              </div>
              {trendLabel && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>

        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: 'var(--beige-light)',
          }}
        >
          <Icon size={24} style={{ color: 'var(--primary)' }} />
        </div>
      </div>
    </div>
  );
}
