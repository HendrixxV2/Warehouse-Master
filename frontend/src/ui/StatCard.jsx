import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, unit, delta, icon: Icon, tone = 'accent' }) {
  const toneMap = {
    accent: 'text-accent bg-accent-muted',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-danger bg-danger/10',
    info: 'text-info bg-info/10',
  };
  const positive = delta >= 0;

  return (
    <div className="rounded-2xl bg-elevated border border-line p-5 shadow-card transition hover:border-line-strong">
      <div className="flex items-start justify-between mb-4">
        <p className="text-[12px] font-medium uppercase tracking-wide text-fg-muted">{label}</p>
        <div className={`size-9 rounded-lg grid place-items-center ${toneMap[tone]}`}>
          <Icon size={16} strokeWidth={2.2} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <p className="text-[28px] font-semibold text-fg mono leading-none">{value}</p>
        {unit && <span className="text-[13px] text-fg-muted mb-1">{unit}</span>}
      </div>
      {delta !== undefined && (
        <div className={`mt-3 flex items-center gap-1.5 text-[12px] font-medium ${positive ? 'text-success' : 'text-danger'}`}>
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span className="mono">{positive ? '+' : ''}{delta}%</span>
          <span className="text-fg-faint font-normal">vs. mes anterior</span>
        </div>
      )}
    </div>
  );
}