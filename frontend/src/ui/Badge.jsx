const TONES = {
  neutral: 'bg-subtle text-fg-muted border-line',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger:  'bg-danger/10  text-danger  border-danger/20',
  info:    'bg-info/10    text-info    border-info/20',
  accent:  'bg-accent-muted text-accent border-accent/25',
};

export default function Badge({ tone = 'neutral', children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 h-6 px-2 rounded-md border text-[11px] font-medium ${TONES[tone]}`}>
      {children}
    </span>
  );
}