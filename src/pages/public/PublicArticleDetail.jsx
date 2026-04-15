import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Eye, MessageSquare, Send, CornerDownRight, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { normalizeMediaUrl } from '../../utils/article';

/* ── Mock articles (same as SearchPage) ────────────────── */
const MOCK_ARTICLES = [
  { id: 1, slug: 'gta-vi-pc-date', title: 'GTA VI PC Release Date Officially Confirmed — Everything You Need to Know', content: 'Rockstar Games finally breaks the silence with a full reveal of GTA VI coming to PC, along with system requirements and exclusive content. The highly anticipated title is set to launch later this year with stunning graphics and an expansive open world set in Vice City.\n\nThe PC version will support ray tracing, DLSS 4, and AMD FSR 3, ensuring the best visual experience possible. System requirements have been officially revealed, and the game will require at least an RTX 3070 for optimal performance at 1440p.\n\nRockstar has also confirmed exclusive PC features including a photo mode, mod support at launch, and ultra-wide monitor compatibility.', category: { name: 'Gaming' }, published_at: '2025-01-15T10:00:00Z', view_count: 142000, featured_image: 'https://picsum.photos/seed/gtavi/1200/600', author: { username: 'gnewz_editorial' } },
  { id: 2, slug: 'rtx-5090-review', title: 'RTX 5090 Review: The Monster GPU That Redefines 4K Gaming', content: "NVIDIA's flagship pushes every boundary. We tested it for 3 weeks across dozens of titles and benchmarks.\n\nThe RTX 5090 delivers a massive 60% performance uplift over the previous generation at 4K resolution. With 32GB of GDDR7 memory and a 512-bit memory bus, this card handles even the most demanding titles with ease.\n\nAt $1,999 MSRP, it's not cheap — but for those who demand the absolute best, the RTX 5090 is the undisputed king of gaming GPUs.", category: { name: 'Hardware' }, published_at: '2025-01-15T06:00:00Z', view_count: 98000, featured_image: 'https://picsum.photos/seed/rtx5090/1200/600', author: { username: 'hardware_review' } },
  { id: 3, slug: 'esl-pro-league-s22', title: 'ESL Pro League S22 — Team Liquid Dominates Opening Week', content: 'The CS2 season opens with jaw-dropping performances and major upsets as Team Liquid storms through the group stage with a perfect record.\n\nTeam Liquid went 5-0 in the opening week, defeating top-seeded teams with a combination of flawless strategy and individual brilliance. Star player "EliGE" posted a 1.45 rating across all matches.\n\nNAVI and FaZe Clan both struggled in the early rounds, raising questions about their form heading into the knockout stage.', category: { name: 'Esports' }, published_at: '2025-01-15T09:00:00Z', view_count: 67000, featured_image: 'https://picsum.photos/seed/esports22/1200/600', author: { username: 'esports_desk' } },
  { id: 4, slug: 'ai-npcs-gaming', title: 'How AI-Driven NPCs Are About to Change Everything in Open-World Games', content: 'From Starfield to Skyrim — the next generation of AI companions is here, and they are fundamentally changing how we interact with game worlds.\n\nDevelopers are now using large language models to power NPCs that can hold dynamic, contextual conversations, remember past interactions, and adapt their behavior based on player choices.\n\nInXile Entertainment recently showcased their new AI NPC system where every character in a town could be spoken to freely — no dialogue trees, just natural conversation.', category: { name: 'Culture' }, published_at: '2025-01-14T14:00:00Z', view_count: 51000, featured_image: 'https://picsum.photos/seed/ainpc/1200/600', author: { username: 'culture_team' } },
  { id: 5, slug: 'ps6-specs', title: 'PS6 Dev Kit Specs Surface Online — 4nm Chip and 32GB VRAM', content: "Sony's next-gen console is shaping up to be an absolute powerhouse. Leaked dev kit specifications reveal a custom 4nm AMD chip paired with 32GB of unified GDDR7 memory.\n\nThe console reportedly targets native 4K at 120fps for most titles and can push 8K output for supported content. A custom SSD with 14GB/s read speeds eliminates load times entirely.\n\nSony is expected to officially announce the PS6 at a special event early next year, with a late 2026 release window.", category: { name: 'Gaming' }, published_at: '2025-01-15T08:00:00Z', view_count: 88000, featured_image: 'https://picsum.photos/seed/ps6/1200/600', author: { username: 'gnewz_editorial' } },
  { id: 6, slug: 'xbox-handheld', title: 'Xbox Handheld: Microsoft Confirms Portable Console Is in Development', content: 'Phil Spencer officially acknowledges the handheld project in a wide-ranging interview, confirming what leakers have been saying for months.\n\n"We are working on a handheld device," Spencer said. "We want to bring the Xbox ecosystem to portable form." The device is expected to run full Xbox games natively and support Xbox Game Pass.\n\nBased on leaked documents, the Xbox handheld will feature a 7-inch OLED display, AMD APU, and up to 10 hours of battery life.', category: { name: 'Gaming' }, published_at: '2025-01-15T05:00:00Z', view_count: 110000, featured_image: 'https://picsum.photos/seed/xboxhand/1200/600', author: { username: 'gnewz_editorial' } },
  { id: 7, slug: 'ryzen-9950x3d', title: 'AMD Ryzen 9 9950X3D: The CPU King Returns with 3D V-Cache', content: "AMD's latest flagship processor combines the raw power of Zen 5 with the gaming magic of 3D V-Cache technology. The result is a CPU that dominates both productivity and gaming workloads.\n\nIn our testing, the 9950X3D posted 18% better 1% lows in CPU-limited games compared to Intel's Core Ultra 9 285K, while also beating it in multi-threaded workloads like rendering and compilation.\n\nAt $699, it's expensive — but it's the most complete high-end desktop processor ever made.", category: { name: 'Hardware' }, published_at: '2025-01-14T08:00:00Z', view_count: 35000, featured_image: 'https://picsum.photos/seed/9950x3d/1200/600', author: { username: 'hardware_review' } },
];

function getMockArticle(slug) {
  return MOCK_ARTICLES.find((a) => a.slug === slug || String(a.id) === String(slug)) ?? null;
}

/* ── Comment component ───────────────────────────────────── */
function Comment({ comment, onReply, t }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-bold">
            {comment.author_name || comment.author?.username || t('article.anonymous')}
          </span>
          <span className="text-gray-600 text-xs">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
        <button
          onClick={() => onReply(comment.id)}
          className="mt-2 flex items-center gap-1 text-xs text-gray-500 hover:text-[#FF6B00] transition-colors"
        >
          <CornerDownRight size={12} /> {t('article.reply')}
        </button>
      </div>
      {/* Nested replies */}
      {comment.replies?.length > 0 && (
        <div className="ml-6 flex flex-col gap-2">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-bold">
                  {reply.author_name || reply.author?.username || t('article.anonymous')}
                </span>
                <span className="text-gray-600 text-xs">
                  {new Date(reply.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function PublicArticleDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();

  const [article, setArticle]   = useState(null);
  const [artLoading, setArtLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [cmtLoading, setCmtLoading] = useState(false);

  const [replyTo, setReplyTo]   = useState(null);

  const [form, setForm] = useState({
    content: '',
    author_name: '',
    author_email: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setArtLoading(true);
    api.get('/articles/', { params: { slug } })
      .then(({ data }) => {
        const found = data.results?.[0];
        if (!found) { setArticle(getMockArticle(slug)); return; }
        return api.get(`/articles/${found.id}/`).then(({ data: full }) => {
          setArticle(full);
          // Increment view and update the displayed count with the real new value
          api.post(`/articles/${full.id}/increment_view/`)
            .then(({ data }) => {
              setArticle(prev => prev ? { ...prev, view_count: data.view_count } : prev);
            })
            .catch(() => {});
        });
      })
      .catch(() => setArticle(getMockArticle(slug)))
      .finally(() => setArtLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!article?.id) return;
    setCmtLoading(true);
    api.get(`/articles/${article.id}/comments/`)
      .then(({ data }) => setComments(data.comments ?? data.results ?? []))
      .catch(() => setComments([]))
      .finally(() => setCmtLoading(false));
  }, [article?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    setSubmitting(true);
    try {
      const payload = { content: form.content };
      if (replyTo) payload.parent = replyTo;
      if (form.author_name.trim()) payload.author_name = form.author_name.trim();
      if (form.author_email.trim()) payload.author_email = form.author_email.trim();

      const { data } = await api.post(`/articles/${article.id}/comments/`, payload);

      if (replyTo) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === replyTo
              ? { ...c, replies: [...(c.replies ?? []), data] }
              : c
          )
        );
      } else {
        setComments((prev) => [data, ...prev]);
      }
      setForm({ content: '', author_name: '', author_email: '' });
      setReplyTo(null);
      toast.success(t('article.commentPosted'));
    } catch {
      toast.error(t('article.commentError'));
    } finally {
      setSubmitting(false);
    }
  };

  if (artLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-white text-xl font-bold">{t('article.notFound')}</p>
        <Link to="/" className="text-[#FF6B00] hover:underline text-sm">← {t('article.back')}</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-16">

      {/* Hero image */}
      {article.featured_image && (
        <div className="w-full max-w-4xl mx-auto px-6 pt-8">
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 'clamp(200px, 35vw, 420px)' }}>
            <img
              src={article.featured_image_b64 || normalizeMediaUrl(article.featured_image)}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </div>
      )}

      {/* Three-column layout: left ad | content | right ad */}
      <div className="flex gap-6 max-w-7xl mx-auto px-4 mt-10 items-start">

        {/* ── Left ad column ── */}
        <aside className="hidden xl:flex flex-col gap-4 w-48 flex-shrink-0 sticky top-24">
          <AdSlot label={t('article.sponsor')} width={192} height={400} seed="left-tall" />
          <AdSlot label={t('article.sponsor')} width={192} height={200} seed="left-small" />
        </aside>

        {/* ── Main content column ── */}
        <div className="flex-1 min-w-0 max-w-2xl mx-auto px-2 sm:px-6 relative">

        {/* Back */}
        <Link
          to="/"
          className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-6 transition-colors w-fit"
        >
          <ArrowLeft size={14} /> {t('article.back')}
        </Link>

        {/* Title */}
        <h1 className="text-white text-2xl sm:text-3xl font-black leading-tight mb-5">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-gray-500 text-xs mb-8 pb-8 border-b border-[#1A1A1A]">
          {article.author?.username && (
            <span className="text-gray-400 font-semibold">{t('article.by')} {article.author.username}</span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {article.view_count?.toLocaleString()} {t('article.views')}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare size={12} />
            {comments.length} {t('article.commentsHeading')}
          </span>
        </div>

        {/* Body */}
        <div
          className="article-body mb-12"
          dangerouslySetInnerHTML={{ __html: article.content ?? article.excerpt ?? '' }}
        />

        {/* ── Comments section ────────────────────────────── */}
        <div>
          <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare size={20} className="text-[#FF6B00]" />
            {t('article.commentsHeading')} {comments.length > 0 && <span className="text-gray-500 text-base font-normal">({comments.length})</span>}
          </h2>

          {/* Comment form */}
          <form onSubmit={handleSubmit} className="bg-[#111] border border-[#1A1A1A] rounded-xl p-5 mb-8">
            {replyTo && (
              <div className="flex items-center justify-between mb-3 text-xs text-[#FF6B00] bg-[#FF6B00]/10 rounded-lg px-3 py-2">
                <span className="flex items-center gap-1"><CornerDownRight size={12} /> {t('article.replyingTo')}</span>
                <button type="button" onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-white transition-colors">✕</button>
              </div>
            )}

            <div className="flex gap-3 mb-3">
              <input
                value={form.author_name}
                onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                placeholder={t('article.namePlaceholder')}
                className="flex-1 bg-[#1A1A1A] border border-[#333] focus:border-[#FF6B00] text-white text-sm rounded-lg px-3 py-2 outline-none transition-colors"
              />
              <input
                type="email"
                value={form.author_email}
                onChange={(e) => setForm({ ...form, author_email: e.target.value })}
                placeholder={t('article.emailPlaceholder')}
                className="flex-1 bg-[#1A1A1A] border border-[#333] focus:border-[#FF6B00] text-white text-sm rounded-lg px-3 py-2 outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder={t('article.commentPlaceholder')}
                required
                rows={3}
                className="w-full bg-[#1A1A1A] border border-[#333] focus:border-[#FF6B00] text-white text-sm rounded-lg px-3 py-2 pr-12 outline-none resize-none transition-colors"
              />
              <button
                type="submit"
                disabled={submitting || !form.content.trim()}
                className="absolute bottom-3 right-3 p-2 bg-[#FF6B00] hover:bg-[#cc5500] disabled:opacity-40 text-white rounded-lg transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </form>

          {/* Comments list */}
          {cmtLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : comments.length > 0 ? (
            <div className="flex flex-col gap-4">
              {comments.map((c) => (
                <Comment key={c.id} comment={c} onReply={setReplyTo} t={t} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <MessageSquare size={32} className="text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">{t('article.noComments')}</p>
            </div>
          )}
        </div>
        </div>{/* end main content column */}

        {/* ── Right ad column ── */}
        <aside className="hidden xl:flex flex-col gap-4 w-48 flex-shrink-0 sticky top-24">
          <AdSlot label={t('article.advertisement')} width={192} height={300} seed="right-tall" />
          <AdSlot label={t('article.advertisement')} width={192} height={250} seed="right-mid" />
          <AdSlot label={t('article.advertisement')} width={192} height={150} seed="right-small" />
        </aside>

      </div>{/* end three-column wrapper */}
    </div>
  );
}

/* ── Ad placeholder component ── */
function AdSlot({ label, width, height, seed }) {
  return (
    <div
      style={{ width, height }}
      className="rounded-xl overflow-hidden border border-[#1f1f1f] bg-[#0d0d0d] flex flex-col relative"
    >
      <img
        src={`https://picsum.photos/seed/${seed}/${width}/${height}`}
        alt="ad"
        className="w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40">
        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600 border border-gray-700 rounded px-2 py-0.5">
          {label}
        </span>
        <span className="text-[8px] text-gray-700">{width}×{height}</span>
      </div>
    </div>
  );
}
