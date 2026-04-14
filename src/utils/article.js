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

export function toCard(article) {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.meta_description || '',
    category: article.category?.name || '',
    tag: article.is_breaking ? 'BREAKING' : article.is_featured ? 'FEATURED' : article.category?.name || '',
    image: article.featured_image || `https://picsum.photos/seed/${article.slug}/800/450`,
    time: timeAgo(article.published_at),
    views: formatViews(article.view_count),
  };
}
