export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function formatViews(n) {
  if (!n) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

/**
 * Normalises media URLs so the Vite proxy (/media → configured backend) always works,
 * regardless of which machine's IP Django encoded into the URL.
 *
 * Handles all formats Django may return:
 *   "http://192.168.1.50:8000/media/articles/img.jpg" → "/media/articles/img.jpg"
 *   "/media/articles/img.jpg"                         → "/media/articles/img.jpg"
 *   "media/articles/img.jpg"                          → "/media/articles/img.jpg"
 *   "articles/img.jpg"                                → "/media/articles/img.jpg"
 */
export function normalizeMediaUrl(url) {
  if (!url) return null;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('/')) return url;          // already a root-relative path
  try {
    const { pathname, search } = new URL(url);  // strips origin from absolute URLs
    return pathname + search;
  } catch {
    // Not a valid absolute URL — Django returned a bare relative path
    if (url.startsWith('media/')) return `/${url}`;   // "media/…" → "/media/…"
    return `/media/${url}`;                            // "articles/…" → "/media/articles/…"
  }
}

export function toCard(article) {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.meta_description || '',
    category: article.category?.name || '',
    tag: article.is_breaking ? 'BREAKING' : article.is_featured ? 'FEATURED' : article.category?.name || '',
    // Prefer base64 (in DB, visible to all teammates) → fall back to file URL → placeholder
    image: article.featured_image_b64 || normalizeMediaUrl(article.featured_image) || `https://picsum.photos/seed/${article.slug}/800/450`,
    time: timeAgo(article.published_at),
    views: formatViews(article.view_count),
  };
}
