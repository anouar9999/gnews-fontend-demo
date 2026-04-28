/**
 * 3D press button — pass any CSS color (hex, rgb, or var(--color-name)).
 * All shadow/glow/floor values derive from `color` via color-mix().
 */
export default function Button3D({
  color = 'var(--color-orange)',
  className = '',
  style = {},
  children,
  ...props
}) {
  const bg    = `linear-gradient(135deg, ${color} 0%, color-mix(in srgb, ${color} 72%, black) 100%)`;
  const floor = `color-mix(in srgb, ${color} 38%, black)`;
  const glow  = (opacity) => `color-mix(in srgb, ${color} ${opacity}%, transparent)`;

  const shadow = (y, blur, glowPct) =>
    `0 ${y}px 0 ${floor}, 0 ${y + 2}px ${blur}px ${glow(glowPct)}, inset 0 1px 0 rgba(255,255,255,0.18)`;

  const base  = shadow(6, 16, 45);
  const hover = shadow(8, 24, 55);
  const down  = `0 2px 0 ${floor}, 0 4px 8px ${glow(30)}, inset 0 1px 0 rgba(255,255,255,0.10)`;

  return (
    <button
      className={`font-black text-white ${className}`}
      style={{
        background: bg,
        boxShadow: base,
        transform: 'translateY(-3px)',
        transition: 'transform 0.08s ease, box-shadow 0.08s ease',
        ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = hover; e.currentTarget.style.transform = 'translateY(-5px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = base;  e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseDown={e  => { e.currentTarget.style.boxShadow = down;  e.currentTarget.style.transform = 'translateY(0px)'; }}
      onMouseUp={e    => { e.currentTarget.style.boxShadow = base;  e.currentTarget.style.transform = 'translateY(-3px)'; }}
      {...props}
    >
      {children}
    </button>
  );
}
