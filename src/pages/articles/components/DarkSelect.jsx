export default function DarkSelect({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2 rounded-lg text-[12px] text-white outline-none appearance-none transition-all duration-150"
      style={{ background: '#111111', border: '1px solid #2a2a2a', color: 'rgba(255,255,255,0.7)' }}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.5)'; }}
      onBlur={e  => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
    >
      {children}
    </select>
  );
}
