const VARIANTS = {
  primary:  'bg-accent text-white hover:bg-accent-hover shadow-sm',
  secondary:'bg-elevated text-fg border border-line hover:border-line-strong',
  ghost:    'text-fg-muted hover:text-fg hover:bg-subtle',
  danger:   'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/15',
};
const SIZES = {
  sm: 'h-8 px-3 text-[12px] rounded-lg gap-1.5',
  md: 'h-9 px-4 text-[13px] rounded-lg gap-2',
  lg: 'h-10 px-5 text-[13px] rounded-lg gap-2',
};

export default function Button({
  variant = 'primary', size = 'md', className = '', children, ...rest
}) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition focus-ring disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}