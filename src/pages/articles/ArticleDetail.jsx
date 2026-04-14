import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Pencil,
  Send,
  Archive,
  Trash2,
  Star,
  Zap,
  Play,
  Bookmark,
  Eye,
  Tag,
  Folder,
  Globe,
  User,
  MessageSquare,
  CornerDownRight,
  X,
} from "lucide-react";
import api from "../../api/axios";
import DeleteModal from "../../components/DeleteModal";
import { useAuth } from "../../context/AuthContext";
import { usePageTitle } from "../../context/PageTitleContext";
import toast from "react-hot-toast";

/* ─── helpers ───────────────────────────────────────────── */

function fmtDateDot(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}.${mm}.${yy}`;
}

function fmtTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ─── status label map ───────────────────────────────────── */
const STATUS_LABEL = {
  nouveau: "New",
  brouillon_ia: "AI Draft",
  en_revision: "In Review",
  publie: "Published",
  archive: "Archived",
};

/* ─── 3-D action button ─────────────────────────────────── */
function ActionBtn({
  icon: Icon,
  label,
  colorRgb,
  onClick,
  as: Tag = "button",
  to,
}) {
  const base = {
    background: `linear-gradient(135deg,rgba(${colorRgb},.18) 0%,rgba(${colorRgb},.08) 100%)`,
    color: `rgb(${colorRgb})`,
    boxShadow: `0 4px 0 rgba(${colorRgb},.25),0 6px 16px rgba(${colorRgb},.15),inset 0 1px 0 rgba(255,255,255,.1)`,
    transform: "translateY(-2px)",
    transition: "transform .08s ease,box-shadow .08s ease",
  };
  const hover = {
    ...base,
    background: `linear-gradient(135deg,rgba(${colorRgb},.28) 0%,rgba(${colorRgb},.14) 100%)`,
    boxShadow: `0 6px 0 rgba(${colorRgb},.3),0 10px 24px rgba(${colorRgb},.25),inset 0 1px 0 rgba(255,255,255,.15)`,
    transform: "translateY(-4px)",
  };
  const pressed = {
    ...base,
    boxShadow: `0 1px 0 rgba(${colorRgb},.2),0 2px 6px rgba(${colorRgb},.1),inset 0 1px 0 rgba(0,0,0,.15)`,
    transform: "translateY(1px)",
  };
  const shared = {
    className:
      "flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold select-none",
    style: { ...base },
    onMouseEnter: (e) => Object.assign(e.currentTarget.style, hover),
    onMouseLeave: (e) => Object.assign(e.currentTarget.style, base),
    onMouseDown: (e) => Object.assign(e.currentTarget.style, pressed),
    onMouseUp: (e) => Object.assign(e.currentTarget.style, hover),
    title: label,
  };
  if (Tag === "button")
    return (
      <button {...shared} onClick={onClick}>
        <Icon size={13} />
        {label}
      </button>
    );
  return (
    <Link {...shared} to={to}>
      <Icon size={13} />
      {label}
    </Link>
  );
}

/* ─── skeleton ──────────────────────────────────────────── */
function Skeleton() {
  const bar = (w, h = 14, mt = 0) => (
    <div
      style={{
        height: h,
        width: w,
        borderRadius: 6,
        background: "rgba(255,255,255,0.06)",
        marginTop: mt,
        animation: "pulse 2s infinite",
      }}
    />
  );
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 0 80px" }}>
      <div style={{ height: 36, marginBottom: 32 }} />
      {bar("60%", 32)}
      {bar("30%", 12, 10)}
      {bar("100%", 14, 20)}
      {bar("90%", 14, 8)}
      {bar("75%", 14, 8)}
      <div
        style={{
          height: 200,
          borderRadius: 12,
          background: "rgba(255,255,255,0.05)",
          marginTop: 28,
          animation: "pulse 2s infinite",
        }}
      />
      {bar("100%", 14, 24)}
      {bar("95%", 14, 8)}
      {bar("88%", 14, 8)}
    </div>
  );
}

/* ─── input style helper ─────────────────────────────────── */
const inputStyle = {
  width: "100%",
  padding: "10px 13px",
  background: "#111111",
  border: "1px solid #2a2a2a",
  borderRadius: 8,
  color: "#fff",
  fontSize: 13,
  outline: "none",
  caretColor: "#FF6B00",
  transition: "border-color .15s, box-shadow .15s",
};

/* ─── single comment card ───────────────────────────────── */
function CommentCard({ comment, articleId, onDelete, canDelete, onReplyClick, isReply = false }) {
  const [hovered, setHovered] = useState(false);

  function fmtAgo(iso) {
    if (!iso) return "";
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <div
      style={{
        position: "relative",
        paddingLeft: isReply ? 0 : 0,
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: isReply
            ? "rgba(255,255,255,0.02)"
            : "linear-gradient(160deg,#161618,#111113)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
          padding: "14px 16px",
          transition: "border-color .15s",
          borderColor: hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 10,
            bottom: 10,
            width: 3,
            borderRadius: "0 2px 2px 0",
            background: hovered ? "rgba(255,107,0,0.35)" : "transparent",
            transition: "background .12s",
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Avatar */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg,rgba(255,107,0,0.3),rgba(255,107,0,0.1))",
                border: "1px solid rgba(255,107,0,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 800,
                color: "#FF6B00",
                flexShrink: 0,
              }}
            >
              {(comment.author_name || "A")[0].toUpperCase()}
            </div>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                {comment.author_name || "Anonymous"}
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginLeft: 8 }}>
                {fmtAgo(comment.created_at)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {!isReply && (
              <button
                onClick={() => onReplyClick(comment.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.28)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "3px 6px",
                  borderRadius: 5,
                  transition: "color .15s, background .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#FF6B00"; e.currentTarget.style.background = "rgba(255,107,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.28)"; e.currentTarget.style.background = "none"; }}
              >
                <CornerDownRight size={11} /> Reply
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  borderRadius: 5,
                  color: "rgba(248,113,113,0.45)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color .15s, background .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(248,113,113,0.45)"; e.currentTarget.style.background = "none"; }}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0 }}>
          {comment.content}
        </p>
      </div>

      {/* Nested replies */}
      {comment.replies?.length > 0 && (
        <div
          style={{
            marginTop: 6,
            marginLeft: 20,
            paddingLeft: 14,
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {comment.replies.map(reply => (
            <CommentCard
              key={reply.id}
              comment={reply}
              articleId={articleId}
              onDelete={onDelete}
              canDelete={canDelete}
              onReplyClick={onReplyClick}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── comment form ──────────────────────────────────────── */
function CommentForm({ articleId, parentId, parentAuthor, onClearParent, onPosted }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (parentId && contentRef.current) contentRef.current.focus();
  }, [parentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !name.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/articles/${articleId}/comments/`, {
        content: content.trim(),
        author_name: name.trim(),
        author_email: email.trim(),
        parent: parentId ?? null,
      });
      setContent("");
      setName("");
      setEmail("");
      onClearParent();
      onPosted();
      toast.success("Comment posted");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Reply context banner */}
      <AnimatePresence>
        {parentId && (
          <motion.div
            key="reply-banner"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255,107,0,0.07)",
              border: "1px solid rgba(255,107,0,0.18)",
              borderRadius: 7,
              padding: "6px 10px",
              overflow: "hidden",
            }}
          >
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 5 }}>
              <CornerDownRight size={11} style={{ color: "#FF6B00" }} />
              Replying to <strong style={{ color: "#FF6B00" }}>{parentAuthor}</strong>
            </span>
            <button
              type="button"
              onClick={onClearParent}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 2, display: "flex" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <input
          required
          placeholder="Your name *"
          value={name}
          onChange={e => setName(e.target.value)}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = "rgba(255,107,0,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,107,0,0.07)"; }}
          onBlur={e => { e.target.style.borderColor = "#2a2a2a"; e.target.style.boxShadow = "none"; }}
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = "rgba(255,107,0,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,107,0,0.07)"; }}
          onBlur={e => { e.target.style.borderColor = "#2a2a2a"; e.target.style.boxShadow = "none"; }}
        />
      </div>

      <textarea
        ref={contentRef}
        required
        placeholder="Write your comment…"
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={3}
        style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
        onFocus={e => { e.target.style.borderColor = "rgba(255,107,0,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,107,0,0.07)"; }}
        onBlur={e => { e.target.style.borderColor = "#2a2a2a"; e.target.style.boxShadow = "none"; }}
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="submit"
          disabled={submitting || !content.trim() || !name.trim()}
          className="flex items-center gap-2 px-4 py-2 text-[12px] font-black text-white tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg,#FF6B00 0%,#e05500 100%)",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 0 #a33a00,0 6px 14px rgba(255,107,0,0.4),inset 0 1px 0 rgba(255,255,255,0.18)",
            transform: "translateY(-2px)",
            transition: "transform .08s ease,box-shadow .08s ease",
          }}
          onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 6px 0 #a33a00,0 10px 20px rgba(255,107,0,0.5),inset 0 1px 0 rgba(255,255,255,0.18)"; }}}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 0 #a33a00,0 6px 14px rgba(255,107,0,0.4),inset 0 1px 0 rgba(255,255,255,0.18)"; }}
          onMouseDown={e  => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "0 2px 0 #a33a00,0 3px 8px rgba(255,107,0,0.3),inset 0 1px 0 rgba(255,255,255,0.1)"; }}
          onMouseUp={e    => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 0 #a33a00,0 6px 14px rgba(255,107,0,0.4),inset 0 1px 0 rgba(255,255,255,0.18)"; }}
        >
          {submitting ? (
            <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #fff", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
          ) : (
            <Send size={12} strokeWidth={3} />
          )}
          {submitting ? "Posting…" : "Post Comment"}
        </button>
      </div>
    </form>
  );
}

/* ─── full comment section ──────────────────────────────── */
function CommentSection({ articleId }) {
  const { canDelete } = useAuth();
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null); // { id, author_name }
  const [deleting, setDeleting] = useState(null);

  const fetchComments = () => {
    setLoading(true);
    api
      .get(`/articles/${articleId}/comments/`)
      .then(({ data }) => {
        setComments(data.comments ?? []);
        setCount(data.count ?? 0);
      })
      .catch(() => toast.error("Failed to load comments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComments(); }, [articleId]);

  const handleDelete = async (commentId) => {
    setDeleting(commentId);
    try {
      await api.delete(`/articles/${articleId}/comments/${commentId}/`);
      toast.success("Comment deleted");
      fetchComments();
    } catch {
      toast.error("Failed to delete comment");
    } finally {
      setDeleting(null);
    }
  };

  const handleReplyClick = (commentId) => {
    const comment = comments.find(c => c.id === commentId);
    setReplyTo(comment ? { id: comment.id, author_name: comment.author_name || "Anonymous" } : null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginTop: 48 }}
    >
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MessageSquare size={16} style={{ color: "#FF6B00" }} />
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>
            Comments
          </h2>
        </div>
        <span
          style={{
            background: "rgba(255,107,0,0.1)",
            border: "1px solid rgba(255,107,0,0.2)",
            color: "#FF6B00",
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 20,
            padding: "2px 8px",
          }}
        >
          {count}
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
      </div>

      {/* Comment list */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2.5px solid #FF6B00", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
        </div>
      ) : comments.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "36px 0",
            color: "rgba(255,255,255,0.18)",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <MessageSquare size={28} style={{ margin: "0 auto 10px", opacity: 0.2, display: "block" }} />
          No comments yet — be the first to share your thoughts.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {comments.map((c) => (
            <CommentCard
              key={c.id}
              comment={c}
              articleId={articleId}
              onDelete={handleDelete}
              canDelete={canDelete}
              onReplyClick={handleReplyClick}
            />
          ))}
        </div>
      )}

      {/* Form */}
      <div
        style={{
          background: "linear-gradient(160deg,#161618,#111113)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Orange top accent */}
        <div style={{ height: "1.5px", background: "linear-gradient(90deg,rgba(255,107,0,0.6),rgba(255,107,0,0) 60%)" }} />
        <div style={{ padding: "18px 20px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Leave a comment
          </p>
          <CommentForm
            articleId={articleId}
            parentId={replyTo?.id ?? null}
            parentAuthor={replyTo?.author_name ?? ""}
            onClearParent={() => setReplyTo(null)}
            onPosted={fetchComments}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canEdit, canDelete } = useAuth();
  const { setPageTitle } = usePageTitle();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/articles/${id}/`)
      .then(({ data }) => {
        setArticle(data);
        setPageTitle(data.title);
      })
      .catch(() => {
        toast.error("Failed to load article");
        navigate("/admin/articles");
      })
      .finally(() => setLoading(false));
    return () => setPageTitle(null);
  }, [id]);

  const handleAction = async (action) => {
    try {
      if (action === "publish") await api.post(`/articles/${id}/publish/`);
      if (action === "archive") await api.post(`/articles/${id}/archive/`);
      toast.success(`Article ${action}d`);
      const { data } = await api.get(`/articles/${id}/`);
      setArticle(data);
    } catch {
      toast.error(`Failed to ${action} article`);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/articles/${id}/`);
      toast.success("Article deleted");
      navigate("/admin/articles");
    } catch {
      toast.error("Failed to delete article");
    }
  };

  if (loading) return <Skeleton />;
  if (!article) return null;

  const thumbnail =
    article.featured_image ?? article.image ?? article.thumbnail ?? null;
  const authorName = article.author?.username ?? article.author ?? null;
  const catName = article.category?.name ?? article.category ?? null;
  const srcName = article.source?.name ?? article.source ?? null;

  /* content — detect whether it's rich HTML (from block editor) or plain text */
  const rawContent = article.content ?? "";
  const isHtmlContent = rawContent.trimStart().startsWith("<");

  // For HTML content: use it all as body, no splitting
  // For plain text: keep the old intro/rest split for backward compat
  const firstNewline = isHtmlContent ? -1 : rawContent.indexOf("\n\n");
  const intro =
    !isHtmlContent && firstNewline > -1
      ? rawContent.slice(0, firstNewline).trim()
      : !isHtmlContent
      ? rawContent.slice(0, 280).trim()
      : "";
  const rest =
    !isHtmlContent && firstNewline > -1
      ? rawContent.slice(firstNewline).trim()
      : !isHtmlContent
      ? rawContent.slice(280).trim()
      : "";
  const summary = article.summary || intro || null;

  /* animation variants */
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <div style={{ minHeight: "100%" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 0 80px" }}>
        {/* ── Top bar: back + actions ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 36,
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(255,255,255,0.35)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
              transition: "color .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.35)";
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {canEdit && (
              <>
                <ActionBtn
                  as={Link}
                  to={`/admin/articles/${id}/edit`}
                  icon={Pencil}
                  label="Edit"
                  colorRgb="96,165,250"
                />
                {article.status !== "publie" && (
                  <ActionBtn
                    icon={Send}
                    label="Publish"
                    colorRgb="74,222,128"
                    onClick={() => handleAction("publish")}
                  />
                )}
                {article.status !== "archive" && (
                  <ActionBtn
                    icon={Archive}
                    label="Archive"
                    colorRgb="251,146,60"
                    onClick={() => handleAction("archive")}
                  />
                )}
              </>
            )}
            {canDelete && (
              <ActionBtn
                icon={Trash2}
                label="Delete"
                colorRgb="248,113,113"
                onClick={() => setShowDelete(true)}
              />
            )}
          </div>
        </motion.div>

        {/* ── Article header ── */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {/* Flags */}
          {(article.is_featured || article.is_breaking) && (
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              {article.is_featured && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(250,204,21,0.1)",
                    color: "#facc15",
                    border: "1px solid rgba(250,204,21,0.2)",
                    borderRadius: 6,
                    padding: "2px 8px",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  <Star size={8} fill="currentColor" /> Featured
                </span>
              )}
              {article.is_breaking && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(248,113,113,0.1)",
                    color: "#f87171",
                    border: "1px solid rgba(248,113,113,0.2)",
                    borderRadius: 6,
                    padding: "2px 8px",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  <Zap size={8} fill="currentColor" /> Breaking
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.25,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {article.title}
          </h1>

          {/* Date */}
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.25)",
              marginTop: 8,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fmtDateDot(article.published_at ?? article.created_at)}
          </p>

          {/* Intro / summary paragraph */}
          {summary && (
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.55)",
                marginTop: 16,
                fontWeight: 400,
              }}
            >
              {summary}
            </p>
          )}
        </motion.div>

        {/* ── Embedded media card ── */}
        {(thumbnail || authorName || catName) && (
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              marginTop: 28,
              borderRadius: 12,
              overflow: "hidden",
              background: "#1a1a1c",
              display: "flex",
              minHeight: 190,
              position: "relative",
            }}
          >
            {/* Bookmark button */}
            <button
              type="button"
              onClick={() => setBookmarked((b) => !b)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 10,
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all .15s",
                color: bookmarked ? "#FF6B00" : "rgba(255,255,255,0.35)",
              }}
              onMouseEnter={(e) => {
                if (!bookmarked) e.currentTarget.style.color = "#FF6B00";
              }}
              onMouseLeave={(e) => {
                if (!bookmarked)
                  e.currentTarget.style.color = "rgba(255,255,255,0.35)";
              }}
            >
              <Bookmark size={13} fill={bookmarked ? "#FF6B00" : "none"} />
            </button>

            {/* Left — thumbnail */}
            <div
              style={{
                flex: "0 0 55%",
                position: "relative",
                overflow: "hidden",
                minHeight: 190,
              }}
            >
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(135deg,#1e1e20 0%,#161618 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Play
                      size={20}
                      style={{ color: "rgba(255,255,255,0.2)", marginLeft: 3 }}
                    />
                  </div>
                </div>
              )}
              {/* Dark gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                }}
              />

              {/* Channel / source badge — top left */}
              {srcName && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(0,0,0,0.55)",
                    borderRadius: 8,
                    padding: "4px 8px",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#FF6B00",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 800,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {srcName[0].toUpperCase()}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#fff",
                        lineHeight: 1.2,
                        margin: 0,
                      }}
                    >
                      {srcName}
                    </p>
                    <p
                      style={{
                        fontSize: 9,
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.2,
                        margin: 0,
                      }}
                    >
                      Source
                    </p>
                  </div>
                </div>
              )}

              {/* Play + views — bottom left */}
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Play
                    size={12}
                    style={{ color: "#111113", marginLeft: 2 }}
                    fill="#111113"
                  />
                </div>
                {article.view_count > 0 && (
                  <span
                    style={{
                      background: "rgba(0,0,0,0.65)",
                      color: "rgba(255,255,255,0.8)",
                      fontSize: 11,
                      fontWeight: 600,
                      borderRadius: 5,
                      padding: "2px 7px",
                      fontVariantNumeric: "tabular-nums",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {article.view_count.toLocaleString()} views
                  </span>
                )}
              </div>
            </div>

            {/* Right — event info panel */}
            <div
              style={{
                flex: 1,
                background: "#1e1e20",
                padding: "20px 18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* Brand + status badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {authorName ? authorName.slice(0, 2).toUpperCase() : "GN"}
                </span>
                <span
                  style={{
                    background: "#FF6B00",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 5,
                    padding: "2px 7px",
                  }}
                >
                  {STATUS_LABEL[article.status] ?? article.status}
                </span>
              </div>

              {/* Date + time */}
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#fff",
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {fmtDateDot(article.published_at ?? article.created_at)}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 500,
                  }}
                >
                  {fmtTime(article.published_at ?? article.created_at) &&
                    `at ${fmtTime(article.published_at ?? article.created_at)}`}
                </span>
              </div>

              {/* Category badge */}
              {catName && (
                <div style={{ marginTop: 10 }}>
                  <span
                    style={{
                      background: "rgba(255,107,0,0.12)",
                      color: "#FF6B00",
                      border: "1px solid rgba(255,107,0,0.25)",
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                    }}
                  >
                    {catName}
                  </span>
                </div>
              )}

              {/* Author / speaker */}
              {authorName && (
                <div style={{ marginTop: 14 }}>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#fff",
                      margin: 0,
                      display: "inline-block",
                      paddingBottom: 3,
                      borderBottom: "2px solid #FF6B00",
                      lineHeight: 1.2,
                    }}
                  >
                    {authorName}
                  </p>
                </div>
              )}

              {/* Title snippet */}
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.4,
                  marginTop: 8,
                  margin: "8px 0 0",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {article.title}
              </p>

              {/* Tags row */}
              {article.tags?.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 5,
                    marginTop: 14,
                  }}
                >
                  {article.tags.slice(0, 4).map((t) => (
                    <span
                      key={t.id ?? t}
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.3)",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 5,
                        padding: "2px 6px",
                      }}
                    >
                      #{t.name ?? t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Body content ── */}
        {(isHtmlContent || rest || (!summary && rawContent)) && (
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ marginTop: 24 }}
          >
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: isHtmlContent ? rawContent : (rest || rawContent) }}
            />
          </motion.div>
        )}

        {/* ── Divider + meta footer ── */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              margin: "40px 0 24px",
            }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px" }}>
            {[
              {
                Icon: Eye,
                val: `${(article.view_count ?? 0).toLocaleString()} views`,
              },
              { Icon: User, val: authorName },
              { Icon: Folder, val: catName },
              { Icon: Globe, val: srcName },
              {
                Icon: Tag,
                val: article.tags?.length
                  ? article.tags.map((t) => `#${t.name ?? t}`).join(" ")
                  : null,
              },
            ]
              .filter((r) => r.val)
              .map(({ Icon, val }) => (
                <span
                  key={val}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.28)",
                    fontWeight: 500,
                  }}
                >
                  <Icon
                    size={11}
                    style={{ color: "rgba(255,255,255,0.18)", flexShrink: 0 }}
                  />
                  {val}
                </span>
              ))}
          </div>
        </motion.div>

        {/* ── Comment section ── */}
        <CommentSection articleId={id} />
      </div>

      {/* ── Delete modal ── */}
      {showDelete && (
        <DeleteModal
          title="Delete Article"
          message={`Are you sure you want to delete "${article.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
