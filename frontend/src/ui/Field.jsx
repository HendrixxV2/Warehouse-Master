export default function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-[12px] font-medium text-fg-muted">{label}</span>
      {children}
      {error && <span className="block mt-1 text-[11px] text-danger">{error}</span>}
    </label>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className="w-full h-9 px-3 rounded-lg bg-base border border-line text-[13px] text-fg placeholder:text-fg-faint focus-ring transition"
    />
  );
}