export default function FieldLabel({ children }) {
  return (
    <p
      className="text-[11px] font-bold uppercase tracking-widest mb-2"
      style={{ color: 'rgba(255,255,255,0.3)' }}
    >
      {children}
    </p>
  );
}
