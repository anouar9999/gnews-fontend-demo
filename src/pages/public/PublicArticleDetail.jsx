import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  Eye,
  MessageSquare,
  Share2,
  Facebook,
  Twitter,
  Bookmark,
  Flame,
  TrendingUp,
} from "lucide-react";
import api from "../../api/axios";
import { normalizeMediaUrl, timeAgo, formatViews } from "../../utils/article";

/* ─── STYLES ────────────────────────────────────────────────────────────────── */
const FontImport = () => (
  <style>{`
    .prose p { margin-bottom: 1.1rem; line-height: 1.8; color: #ccccd8; font-size: 15px; }
    .prose h2 { font-size: 20px; font-weight: 800; color: #fff; margin: 1.8rem 0 0.7rem; line-height: 1.3; }
    .prose h3 { font-size: 16px; font-weight: 700; color: #e0e0ee; margin: 1.4rem 0 0.5rem; }
    .prose strong { color: #fff; font-weight: 700; }
    .prose em { color: #aaaabc; font-style: italic; }
    .prose a { color: #f59e0b; text-decoration: underline; }
    .prose a:hover { color: #fbbf24; }
    .prose ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; color: #ccccd8; }
    .prose ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1rem; color: #ccccd8; }
    .prose li { font-size: 15px; line-height: 1.8; margin-bottom: 0.3rem; }
    .prose img { width: 100%; border-radius: 2px; margin: 1.5rem 0; }
    .prose figure { margin: 1.5rem 0; }
    .prose figcaption { text-align: center; font-size: 11px; color: #555566; margin-top: 0.5rem; font-style: italic; }
    .prose blockquote { border-left: 3px solid #f59e0b; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #888899; }
    .prose pre { background: #0d0d18; border: 1px solid #1a1a28; border-radius: 4px; padding: 1rem; overflow-x: auto; margin-bottom: 1rem; }
    .prose code { font-family: monospace; font-size: 13px; color: #f59e0b; background: rgba(245,158,11,0.1); padding: 1px 4px; border-radius: 2px; }
    .prose pre code { background: none; padding: 0; color: #ccccd8; }
    ::-webkit-scrollbar { width: 5px; background: #0a0a14; }
    ::-webkit-scrollbar-thumb { background: #2a2a38; border-radius: 3px; }
  `}</style>
);

/* ─── HELPERS ───────────────────────────────────────────────────────────────── */
function Tag({ label, color }) {
  return (
    <span
      className="text-[10px] font-black uppercase tracking-widest px-2 py-[3px] text-white inline-block"
      style={{ background: color || "#e8001c" }}
    >
      {label}
    </span>
  );
}

/* ─── BREADCRUMB ────────────────────────────────────────────────────────────── */
function Breadcrumb({ category, title }) {
  return (
    <nav className="flex items-center gap-1.5 text-[11px] text-[#555566] mb-4 flex-wrap">
      <span className="flex items-center gap-1.5">
        <Link to="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight size={10} className="text-[#333344]" />
      </span>
      {category && (
        <span className="flex items-center gap-1.5">
          <Link
            to={`/${category.slug}`}
            className="hover:text-white transition-colors capitalize"
          >
            {category.name}
          </Link>
          <ChevronRight size={10} className="text-[#333344]" />
        </span>
      )}
      <span className="text-[#888899] truncate max-w-[300px]">{title}</span>
    </nav>
  );
}

/* ─── SHARE BAR ─────────────────────────────────────────────────────────────── */
function ShareBar({ views, comments }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-y border-[#1a1a28] my-4">
      <div className="flex items-center gap-4 text-[11px] text-[#555566]">
        <span className="flex items-center gap-1.5">
          <Eye size={12} /> {views}
        </span>
        <span className="flex items-center gap-1.5">
          <MessageSquare size={12} /> {comments} comments
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1877f2]/10 border border-[#1877f2]/20 text-[#1877f2] text-[11px] font-bold hover:bg-[#1877f2]/20 transition-colors rounded-sm">
          <Facebook size={12} /> Share
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1da1f2]/10 border border-[#1da1f2]/20 text-[#1da1f2] text-[11px] font-bold hover:bg-[#1da1f2]/20 transition-colors rounded-sm">
          <Twitter size={12} /> Tweet
        </button>
        <button className="w-7 h-7 flex items-center justify-center border border-[#1e1e2e] text-[#555566] hover:text-white hover:border-[#555566] transition-colors rounded-sm">
          <Bookmark size={13} />
        </button>
        <button className="w-7 h-7 flex items-center justify-center border border-[#1e1e2e] text-[#555566] hover:text-white hover:border-[#555566] transition-colors rounded-sm">
          <Share2 size={13} />
        </button>
      </div>
    </div>
  );
}

/* ─── AUTHOR BOX ────────────────────────────────────────────────────────────── */
function AuthorBox({ author }) {
  if (!author) return null;
  const name =
    author.full_name ||
    `${author.first_name || ""} ${author.last_name || ""}`.trim() ||
    author.username ||
    "Gnewz Staff";
  const initials = name.slice(0, 2).toUpperCase();
  const avatarSrc =
    author.avatar ||
    author.profile_picture ||
    `https://placehold.co/48x48/1a1a2e/ffffff?text=${initials}`;

  return (
    <div className="flex items-start gap-4 p-4 bg-[#1c1c1e] border border-[#2a2a2a] rounded-md mt-8">
      <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[13px] font-black text-[#888899] shrink-0 overflow-hidden">
        <img
          src={avatarSrc}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentNode.textContent = initials;
          }}
        />
      </div>
      <div>
        <p className="text-[11px] text-[#555566] uppercase tracking-widest font-bold mb-0.5">
          Written by
        </p>
        <p className="text-white font-black text-[15px]">{name}</p>
        <p className="text-[12px] text-[#888899] mt-0.5 leading-snug">
          GNEWZ Staff Writer
        </p>
      </div>
    </div>
  );
}

/* ─── TAGS BAR ──────────────────────────────────────────────────────────────── */
function TagsBar({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {tags.map((t) => {
        const label = t.name || t;
        const slug = t.slug || label;
        return (
          <Link
            key={slug}
            to={`/tag/${slug}`}
            className="text-[11px] font-semibold text-[#888899] px-3 py-1.5 bg-[#1c1c1e] border border-[#2a2a2a] hover:border-orange hover:text-white transition-colors rounded-sm"
          >
            #{label}
          </Link>
        );
      })}
    </div>
  );
}

/* ─── COMMENT FORM ──────────────────────────────────────────────────────────── */
function CommentForm({ onSubmit, onCancel, compact = false }) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [text,  setText]  = useState("");
  const [busy,  setBusy]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setBusy(true);
    await onSubmit({ name: name.trim(), email: email.trim(), text: text.trim() });
    setName(""); setEmail(""); setText("");
    setBusy(false);
  };

  const inputCls = "w-full bg-[#1a1a2e] border border-[#2a2a3a] text-[13px] text-white px-3 py-2.5 outline-none focus:border-orange placeholder-[#444455] rounded-sm transition-colors";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className={`grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name *"
          required
          className={inputCls}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email (optional)"
          className={inputCls}
        />
      </div>
      <textarea
        rows={compact ? 3 : 4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your thoughts…"
        required
        className={`${inputCls} resize-none`}
      />
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-[12px] font-bold text-[#888899] hover:text-white border border-[#2a2a3a] rounded-sm transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={busy || !name.trim() || !text.trim()}
          className="px-5 py-2 text-white font-black text-[12px] uppercase tracking-wider rounded-sm disabled:opacity-40 transition-opacity"
          style={{ background: "linear-gradient(135deg,#FF6B00 0%,#e05500 100%)", boxShadow: "0 4px 0 #a33a00" }}
        >
          {busy ? "Posting…" : "Confirm"}
        </button>
      </div>
    </form>
  );
}

/* ─── AVATAR helper ─────────────────────────────────────────────────────────── */
function Avatar({ name, size = 9 }) {
  const hue = (name.charCodeAt(0) * 47 + (name.charCodeAt(1) || 0) * 13) % 360;
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center font-black shrink-0 text-white`}
      style={{ background: `hsl(${hue},48%,30%)`, fontSize: size === 9 ? 12 : 10 }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ─── SINGLE COMMENT ITEM ───────────────────────────────────────────────────── */
function CommentItem({ comment, ownedIds, onReply, onDelete, onDeleteReply }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const isOwned = ownedIds.has(comment.id);

  return (
    <div className="bg-[#0d0d18] border border-[#1a1a28] rounded-sm p-4">
      <div className="flex gap-3">
        <Avatar name={comment.name} size={9} />

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-black text-white">{comment.name}</span>
              {comment.date && <span className="text-[10px] text-[#555566]">{fmtDate(comment.date)}</span>}
            </div>
            {isOwned && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-[10px] font-bold text-[#444455] hover:text-[#e8001c] transition-colors shrink-0"
                title="Delete your comment"
              >
                ✕ Delete
              </button>
            )}
          </div>

          {/* Body */}
          <p className="text-[13px] text-[#ccccdd] leading-relaxed">{comment.text}</p>

          {/* Actions */}
          <button
            onClick={() => setShowReplyForm((v) => !v)}
            className="mt-2 text-[11px] font-bold text-[#555566] hover:text-orange transition-colors"
          >
            ↩ Reply
          </button>

          {/* Reply form */}
          {showReplyForm && (
            <div className="mt-3 pl-3 border-l-2 border-[#2a2a3a]">
              <CommentForm
                compact
                onSubmit={async (data) => { await onReply(comment.id, data); setShowReplyForm(false); }}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {/* Nested replies */}
          {comment.replies?.length > 0 && (
            <div className="mt-3 flex flex-col gap-2 pl-1">
              {comment.replies.map((r) => (
                <div key={r.id} className="flex gap-2.5 bg-[#111120] border border-[#1a1a28] rounded-sm p-3">
                  <Avatar name={r.name} size={7} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-black text-white">{r.name}</span>
                        {r.date && <span className="text-[10px] text-[#555566]">{fmtDate(r.date)}</span>}
                      </div>
                      {ownedIds.has(r.id) && (
                        <button
                          onClick={() => onDeleteReply(comment.id, r.id)}
                          className="text-[10px] font-bold text-[#444455] hover:text-[#e8001c] transition-colors shrink-0"
                          title="Delete your reply"
                        >
                          ✕ Delete
                        </button>
                      )}
                    </div>
                    <p className="text-[12px] text-[#ccccdd] leading-relaxed">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── localStorage helpers ───────────────────────────────────────────────────── */
function loadComments(slug) {
  try { return JSON.parse(localStorage.getItem(`gnewz_comments_${slug}`)) || []; }
  catch { return []; }
}
function saveComments(slug, data) {
  try { localStorage.setItem(`gnewz_comments_${slug}`, JSON.stringify(data)); } catch {}
}
function loadOwned(slug) {
  try { return new Set(JSON.parse(localStorage.getItem(`gnewz_owned_${slug}`)) || []); }
  catch { return new Set(); }
}
function saveOwned(slug, set) {
  try { localStorage.setItem(`gnewz_owned_${slug}`, JSON.stringify([...set])); } catch {}
}

/* ─── COMMENTS SECTION ──────────────────────────────────────────────────────── */
function CommentsSection({ slug }) {
  const [comments, setComments] = useState(() => loadComments(slug));
  const [ownedIds, setOwnedIds] = useState(() => loadOwned(slug));

  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  /* persist on every change */
  useEffect(() => { saveComments(slug, comments); }, [slug, comments]);
  useEffect(() => { saveOwned(slug, ownedIds); }, [slug, ownedIds]);

  /* add comment */
  const handleSubmit = async ({ name, email, text }) => {
    const id = Date.now();
    const newComment = { id, name, email, text, date: new Date().toISOString(), replies: [] };
    try {
      await api.post(`/articles/${slug}/comments/`, { author_name: name, author_email: email, content: text });
    } catch {}
    setComments((prev) => [newComment, ...prev]);
    setOwnedIds((prev) => new Set([...prev, id]));
  };

  /* add reply */
  const handleReply = async (parentId, { name, email, text }) => {
    const id = Date.now();
    const newReply = { id, name, email, text, date: new Date().toISOString() };
    setComments((prev) =>
      prev.map((c) => c.id === parentId ? { ...c, replies: [...(c.replies || []), newReply] } : c)
    );
    setOwnedIds((prev) => new Set([...prev, id]));
  };

  /* delete comment (only own) */
  const handleDelete = (id) => {
    if (!ownedIds.has(id)) return;
    setComments((prev) => prev.filter((c) => c.id !== id));
    setOwnedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
  };

  /* delete reply (only own) */
  const handleDeleteReply = (parentId, replyId) => {
    if (!ownedIds.has(replyId)) return;
    setComments((prev) =>
      prev.map((c) => c.id === parentId ? { ...c, replies: (c.replies || []).filter((r) => r.id !== replyId) } : c)
    );
    setOwnedIds((prev) => { const s = new Set(prev); s.delete(replyId); return s; });
  };

  return (
    <section className="mt-10 pt-6 border-t border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-[3px] h-5 bg-orange rounded-full" />
        <h2 className="text-[15px] font-black uppercase tracking-widest text-white">
          Comments <span className="text-[#555566] ml-1">({totalCount})</span>
        </h2>
      </div>

      {/* Form box */}
      <div className="mb-8 bg-[#0d0d18] border border-[#1a1a28] p-4 rounded-sm">
        <p className="text-[12px] font-bold text-white mb-3">Leave a comment</p>
        <CommentForm onSubmit={handleSubmit} />
      </div>

      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              ownedIds={ownedIds}
              onReply={handleReply}
              onDelete={handleDelete}
              onDeleteReply={handleDeleteReply}
            />
          ))}
        </div>
      ) : (
        <p className="text-[12px] text-[#444455] text-center py-6">
          Be the first to comment.
        </p>
      )}
    </section>
  );
}

/* ─── CATEGORY CONFIG ───────────────────────────────────────────────────────── */
const CATEGORY_COLORS = {
  gaming:   '#e8001c',
  hardware: '#3b82f6',
  culture:  '#a855f7',
  esports:  '#f59e0b',
};

function categoryColor(slug) {
  return CATEGORY_COLORS[slug] || '#f59e0b';
}

function mapSidebarArticle(a) {
  return {
    slug:  a.slug,
    title: a.title,
    image: a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/400/240`,
    time:  timeAgo(a.published_at),
    views: formatViews(a.view_count),
    tag:   a.category?.name || 'NEWS',
    tagColor: categoryColor(a.category?.slug),
  };
}

/* ── Widget: section header ── */
function WidgetHeader({ title, icon: Icon, color, href }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {Icon
          ? <Icon size={14} style={{ color }} />
          : <div className="w-[3px] h-5 rounded-full" style={{ background: color }} />}
        <h3 className="text-[13px] font-black uppercase tracking-widest text-white">{title}</h3>
      </div>
      {href && (
        <Link to={href} className="text-[10px] font-bold uppercase tracking-widest text-[#444455] hover:text-white transition-colors flex items-center gap-0.5">
          All <ChevronRight size={9} />
        </Link>
      )}
    </div>
  );
}

/* ── Widget 1: Latest category news (featured + list) ── */
function LatestNewsWidget({ categorySlug, excludeSlug }) {
  const [articles, setArticles] = useState([]);
  const color = categoryColor(categorySlug);
  const label = categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : 'Latest';

  useEffect(() => {
    if (!categorySlug) return;
    api.get('/articles/', { params: { status: 'publie', category__slug: categorySlug, ordering: '-published_at', page_size: 7 } })
      .then(({ data }) => {
        const all = (data.results || []).filter(a => a.slug !== excludeSlug).slice(0, 5).map(mapSidebarArticle);
        setArticles(all);
      }).catch(() => {});
  }, [categorySlug, excludeSlug]);

  if (!articles.length) return null;
  const [featured, ...rest] = articles;

  return (
    <div>
      <WidgetHeader title={`Latest ${label} News`} color={color} href={`/${categorySlug}`} />

      {/* Featured */}
      <Link to={`/articles/${featured.slug}`} className="block group mb-px bg-[#0d0d18] hover:bg-[#12121e] transition-colors">
        <div className="overflow-hidden">
          <img src={featured.image} alt={featured.title}
            className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-400"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${featured.slug}/400/225`; }} />
        </div>
        <div className="p-2.5">
          <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-[2px] text-white inline-block mb-1" style={{ background: color }}>
            {featured.tag}
          </span>
          <p className="text-[13px] font-bold text-white leading-snug line-clamp-2 group-hover:text-orange transition-colors">
            {featured.title}
          </p>
          <span className="text-[10px] text-[#555566] flex items-center gap-1 mt-1">
            <Clock size={9} /> {featured.time}
          </span>
        </div>
      </Link>

      {/* Small list */}
      <div className="flex flex-col gap-px bg-[#1a1a28] mt-px">
        {rest.map(a => (
          <Link key={a.slug} to={`/articles/${a.slug}`}
            className="flex gap-2.5 p-2.5 bg-[#0d0d18] hover:bg-[#12121e] transition-colors group">
            <div className="shrink-0 w-[72px] h-[46px] overflow-hidden">
              <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${a.slug}/200/130`; }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] font-semibold text-[#ccccdd] leading-snug line-clamp-2 group-hover:text-white transition-colors">
                {a.title}
              </p>
              <span className="text-[10px] text-[#555566] flex items-center gap-1 mt-0.5">
                <Clock size={8} /> {a.time}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link to={`/${categorySlug}`}
        className="flex items-center justify-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-widest text-[#444455] hover:text-white transition-colors py-2 border border-[#1a1a28] hover:border-[#333344]">
        See all {label} news <ChevronRight size={9} />
      </Link>
    </div>
  );
}

/* ── Widget 2: Top articles (numbered by views) ── */
function TopArticlesWidget({ excludeSlug }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get('/articles/', { params: { status: 'publie', ordering: '-view_count,-published_at', page_size: 7 } })
      .then(({ data }) => {
        const all = (data.results || []).filter(a => a.slug !== excludeSlug).slice(0, 5).map(a => ({
          slug:  a.slug,
          title: a.title,
          views: formatViews(a.view_count),
          tag:   a.category?.name || 'NEWS',
          tagColor: categoryColor(a.category?.slug),
        }));
        setArticles(all);
      }).catch(() => {});
  }, [excludeSlug]);

  if (!articles.length) return null;

  return (
    <div>
      <WidgetHeader title="Top Articles" icon={TrendingUp} color="#f59e0b" />
      <div className="flex flex-col gap-px bg-[#1a1a28]">
        {articles.map((a, i) => (
          <Link key={a.slug} to={`/articles/${a.slug}`}
            className="flex items-start gap-3 p-3 bg-[#0d0d18] hover:bg-[#12121e] transition-colors group">
            <span className="shrink-0 w-7 h-7 flex items-center justify-center text-[11px] font-black text-white"
              style={{ background: i < 3 ? '#f59e0b' : '#1a1a28' }}>
              {i + 1}
            </span>
            <div className="min-w-0">
              <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-[2px] text-white inline-block mb-1" style={{ background: a.tagColor }}>
                {a.tag}
              </span>
              <p className="text-[12px] font-semibold text-[#ccccdd] leading-snug line-clamp-2 group-hover:text-white transition-colors">
                {a.title}
              </p>
              {a.views && (
                <span className="text-[10px] text-[#444455] flex items-center gap-1 mt-0.5">
                  <Eye size={8} /> {a.views}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Widget 3: Popular Games (API-fetched, compact vertical) ── */
function PopularGamesWidget() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    api.get('/games/', { params: { game_type: 'popular', page_size: 8, ordering: 'rank' } })
      .then(({ data }) => setGames(data.results || data))
      .catch(() => {});
  }, []);

  if (!games.length) return null;

  return (
    <div>
      <WidgetHeader title="Popular Games" icon={Flame} color="#10b981" href="/gaming" />
      <div className="flex flex-col gap-px bg-[#1a1a28]">
        {games.map((g, i) => (
          <Link key={g.id} to={`/games/${g.slug}`}
            className="flex items-center gap-3 p-2.5 bg-[#0d0d18] hover:bg-[#12121e] transition-colors group">
            <span className="shrink-0 w-7 h-7 flex items-center justify-center text-[11px] font-black text-white"
              style={{ background: i < 3 ? '#10b981' : '#1a1a28' }}>
              {g.rank || i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-white leading-snug line-clamp-1 group-hover:text-[#10b981] transition-colors">{g.title}</p>
              {g.players && <p className="text-[10px] text-[#555566] mt-0.5">{g.players}</p>}
            </div>
          </Link>
        ))}
      </div>
      <Link to="/gaming"
        className="flex items-center justify-center gap-1 mt-1 py-2 text-[10px] font-black uppercase tracking-widest text-white border border-[#1a1a28] hover:border-[#10b981] hover:text-[#10b981] transition-colors">
        Top Games <ChevronRight size={9} />
      </Link>
    </div>
  );
}

/* ── Widget 4: Most Anticipated Games (API-fetched, compact vertical) ── */
function AnticipatedGamesWidget() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    api.get('/games/', { params: { game_type: 'anticipated', page_size: 8, ordering: 'rank' } })
      .then(({ data }) => setGames(data.results || data))
      .catch(() => {});
  }, []);

  if (!games.length) return null;

  return (
    <div>
      <WidgetHeader title="Most Anticipated" icon={Flame} color="#f97316" href="/gaming" />
      <div className="flex flex-col gap-px bg-[#1a1a28]">
        {games.map((g, i) => (
          <Link key={g.id} to={`/games/${g.slug}`}
            className="flex items-center gap-3 p-2.5 bg-[#0d0d18] hover:bg-[#12121e] transition-colors group">
            <span className="shrink-0 w-7 h-7 flex items-center justify-center text-[11px] font-black text-white"
              style={{ background: i < 3 ? '#f97316' : '#1a1a28' }}>
              {g.rank || i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-white leading-snug line-clamp-1 group-hover:text-[#f97316] transition-colors">{g.title}</p>
              {g.release_display && <p className="text-[10px] text-[#555566] mt-0.5">{g.release_display}</p>}
            </div>
          </Link>
        ))}
      </div>
      <Link to="/gaming"
        className="flex items-center justify-center gap-1 mt-1 py-2 text-[10px] font-black uppercase tracking-widest text-white border border-[#1a1a28] hover:border-[#f97316] hover:text-[#f97316] transition-colors">
        Most Anticipated <ChevronRight size={9} />
      </Link>
    </div>
  );
}

/* ─── SIDEBAR ───────────────────────────────────────────────────────────────── */
function Sidebar({ categorySlug, currentSlug }) {
  const crossPromoSlug = categorySlug === 'gaming' ? 'esports' : 'gaming';

  return (
    <aside className="flex flex-col gap-8">

      {/* 1 — Latest news from same category */}
      <LatestNewsWidget categorySlug={categorySlug} excludeSlug={currentSlug} />

      {/* 2 — Top most-read articles */}
      <TopArticlesWidget excludeSlug={currentSlug} />

      {/* 3 — Cross-promo: gaming ↔ esports, hardware/culture → gaming */}
      <LatestNewsWidget categorySlug={crossPromoSlug} excludeSlug={currentSlug} />

      {/* 4 — Popular Games */}
      <PopularGamesWidget />

      {/* 5 — Most Anticipated */}
      <AnticipatedGamesWidget />

    </aside>
  );
}

/* ─── LOADING STATE ─────────────────────────────────────────────────────────── */
function LoadingState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#f59e0b", borderTopColor: "transparent" }}
        />
        <p className="text-[#555566] text-[13px] font-semibold uppercase tracking-widest">
          Loading article…
        </p>
      </div>
    </div>
  );
}

/* ─── ERROR STATE ───────────────────────────────────────────────────────────── */
function ErrorState({ message }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-6">
        <p
          className="font-black text-[28px] uppercase mb-3"
          style={{ color: "#e8001c" }}
        >
          Article not found
        </p>
        <p className="text-[#555566] text-[14px] mb-8 max-w-sm mx-auto leading-relaxed">
          {message ||
            "This article may have been moved, deleted, or does not exist."}
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 text-white font-black text-[12px] uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
          style={{ background: "#f59e0b" }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

/* ─── ROOT COMPONENT ────────────────────────────────────────────────────────── */
export default function PublicArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");
    setArticle(null);

    api
      .get(`/articles/${slug}/`)
      .then(({ data }) => setArticle(data))
      .catch(() =>
        setError("This article could not be loaded. It may not exist or is unavailable.")
      )
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingState />;
  if (error || !article) return <ErrorState message={error} />;

  /* ── Derived values ── */
  const image =
    article.featured_image_b64 ||
    normalizeMediaUrl(article.featured_image) ||
    `https://picsum.photos/seed/${article.slug}/860/480`;

  const categoryColor = "#f59e0b";

  const authorName =
    article.author?.full_name ||
    `${article.author?.first_name || ""} ${article.author?.last_name || ""}`.trim() ||
    article.author?.username ||
    "Gnewz Staff";

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const views = formatViews(article.view_count);
  const commentsCount = article.comments_count || 0;
  const tags = article.tags || [];

  return (
    <>
      <FontImport />
      <div className="min-h-screen text-white">
        <main className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-12 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

            {/* ── Main article column ── */}
            <article>
              <Breadcrumb category={article.category} title={article.title} />

              {/* Category + Title + Subtitle */}
              <div className="mb-4">
                <span
                  className="text-[11px] font-black uppercase tracking-widest px-2 py-1 text-white inline-block mb-3"
                  style={{ background: categoryColor }}
                >
                  {article.category?.name || "NEWS"}
                </span>
                <h1 className="text-[22px] md:text-[28px] lg:text-[38px] font-black uppercase tracking-tighter text-white leading-tight mb-2">
                  {article.title}
                </h1>
                {article.meta_description && (
                  <p className="text-[#888899] text-[15px] leading-relaxed">
                    {article.meta_description}
                  </p>
                )}
              </div>

              {/* Author + date */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#1a1a2e] flex items-center justify-center text-[12px] font-black text-[#888899] shrink-0">
                  {authorName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="text-[13px] font-bold text-white">
                    {authorName}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-[#555566]">
                    {publishedDate && (
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {publishedDate}
                      </span>
                    )}
                    {article.read_time && (
                      <>
                        <span>·</span>
                        <span>{article.read_time} min read</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Share bar */}
              <ShareBar views={views} comments={commentsCount} />

              {/* Featured image */}
              <figure className="mb-6">
                <img
                  src={image}
                  alt={article.title}
                  className="w-full aspect-[16/9] object-cover"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${article.slug}/860/480`; }}
                />
              </figure>

              {/* Article body — rendered as HTML from the CMS */}
              {article.content ? (
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <div className="prose">
                  <p className="text-[#555566]">No content available for this article.</p>
                </div>
              )}

              {/* Bottom share */}
              <ShareBar views={views} comments={commentsCount} />

              {/* Author box */}
              <AuthorBox author={article.author} />

              {/* Tags */}
              <TagsBar tags={tags} />

              {/* Comments */}
              <CommentsSection slug={article.slug} />
            </article>

            {/* ── Sidebar ── */}
            <div className="hidden lg:block">
              <Sidebar
                categorySlug={article.category?.slug}
                currentSlug={slug}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
