import { TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StatCard({ label, value, unit, delta, icon: Icon, tone = 'accent', to, onClick }) {
  const toneMap = {
    accent: 'text-accent bg-accent-muted',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-danger bg-danger/10',
    info: 'text-info bg-info/10',
  };
  const positive = delta >= 0;

  const content = (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-fg-muted">{label}</p>
        <div className={`size-8 rounded-lg grid place-items-center ${toneMap[tone]}`}>
          <Icon size={16} strokeWidth={2.2} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <p className="dashboard-kpi-value text-[27px] font-semibold mono leading-none">{value}</p>
        {unit && <span className="text-[13px] text-fg-muted mb-1">{unit}</span>}
      </div>
      {delta !== undefined && (
        <div className={`mt-3 flex items-center gap-1.5 text-[12px] font-medium ${positive ? 'text-success' : 'text-danger'}`}>
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span className="mono">{positive ? '+' : ''}{delta}%</span>
          <span className="text-fg-faint font-normal">vs. mes anterior</span>
        </div>
      )}
    </>
  );

  const className = `dashboard-kpi block w-full rounded-xl border border-line p-4 shadow-card text-left transition hover:border-line-strong ${to || onClick ? 'cursor-pointer hover:-translate-y-0.5 focus-ring' : ''}`;

  if (to) return <Link to={to} className={className} aria-label={`Ver ${label}`}>{content}</Link>;
  if (onClick) return <button type="button" onClick={onClick} className={className}>{content}</button>;
  return <div className={className}>{content}</div>;
}
