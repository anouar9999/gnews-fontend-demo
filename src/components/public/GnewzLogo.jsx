/**
 * GnewzLogo
 * variant="dark"  → logo-dark.png  (use on dark/black backgrounds)
 * variant="light" → logo-light.png (use on white/light backgrounds)
 * size controls the WIDTH so the logo is always clearly visible
 */
export default function GnewzLogo({ size = 160, variant = 'dark' }) {
  const src = variant === 'dark' ? '/logo-dark.png' : '/logo-light.png';

  return (
    <img
      src={src}
      alt="GNEWZ"
      style={{ width: size, height: 'auto', display: 'block', objectFit: 'contain' }}
    />
  );
}
