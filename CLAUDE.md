# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, port 5173)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test suite is configured.

---

## Architecture

This is the frontend for **GNEWZ**, a gaming/esports news CMS. It has two distinct surfaces:

### 1. Public Site (`/`, `/gaming`, `/hardware`, `/culture`, `/esports`, `/search`)
- Wrapped in `GnewzLayout` (Navbar, BreakingTicker, Footer)
- Dark-themed, consumer-facing news site
- Reads from the Django backend API via `src/api/axios.js`

### 2. Admin CMS (`/admin/*`)
- Two admin layouts:
  - `AdminPreviewLayout` — renders the public site inside the admin context (preview mode)
  - `AdminLayout` — full CMS shell with `AdminSidebar` for managing content
- Protected by `ProtectedRoute` which checks `AuthContext` for a valid JWT
- Logout: `AdminLayout` calls `logout()` from `AuthContext` then navigates to `/admin/login`

### API Layer (`src/api/axios.js`)
- All requests go to `/api` (proxied to `http://localhost:8000` in dev via `vite.config.js`)
- JWT auth: `access_token` + `refresh_token` stored in `localStorage`
- Auto-refresh on 401 responses; redirects to `/login` on refresh failure
- Media files served from `/media` (also proxied to Django)

### Auth (`src/context/AuthContext.jsx`)
- `user_type` field controls permissions: `admin` can delete; `admin` or `editor` can edit
- Exposes: `isAdmin`, `isEditor`, `canEdit`, `canDelete`, `login`, `logout`

### Page Title Context (`src/context/PageTitleContext.jsx`)
- Allows any page to push a dynamic title into the `AdminLayout` header
- Usage: `const { setPageTitle } = usePageTitle(); useEffect(() => { setPageTitle('My Title'); return () => setPageTitle(null); }, []);`

### i18n (`src/i18n/index.js`)
- English and Arabic translations inline in a single file
- Language persisted in `localStorage` under key `gnewz-lang`
- RTL layout for Arabic — the `LanguageSwitch` component toggles `document.dir`

### Shared Components (`src/components/`)
- `DataTable` — legacy paginated table (being phased out — use custom dark tables instead, see below)
- `StatusBadge` — maps backend status strings to colored badges
- `AdminSidebar` — collapsible nav with mobile drawer support
- `DeleteModal` — confirmation dialog used across all CRUD delete flows
- `ProtectedRoute` — redirect-to-login guard

### Backend API Reference
See `API.md` for the full Django REST API endpoint list. Key patterns:
- Auth: `POST /api/auth/login/` returns `{ tokens: { access, refresh }, user }`
- Articles: `/publish/`, `/archive/`, `/increment_view/` custom actions
- Raw news: `/bulk-delete/`, `/bulk-status/` bulk operations

---

## Admin CMS — Page Architecture

Every CRUD resource follows the same pattern. **Forms are overlay drawers, not separate routes.**

### Route structure (App.jsx)
Each resource has a single list route. The form is rendered as an overlay inside the list:
```jsx
<Route path="articles"      element={<ArticleList />} />
<Route path="articles/new"  element={<ArticleForm />} />   // ArticleForm is full-screen editor
<Route path="articles/:id"  element={<ArticleDetail />} />
<Route path="articles/:id/edit" element={<ArticleForm />} />

// All other resources — list only, form is an overlay drawer:
<Route path="categories"  element={<CategoryList />} />
<Route path="tags"        element={<TagList />} />
<Route path="sources"     element={<SourceList />} />
<Route path="media"       element={<MediaList />} />
<Route path="raw-news"    element={<RawNewsList />} />
<Route path="users"       element={<UserList />} />
```

### Form overlay pattern
Forms (except ArticleForm) accept props and are rendered inside their parent list via `AnimatePresence`:
```jsx
// In the list component:
const [formState, setFormState] = useState(null); // null=closed, { editId }=open

<AnimatePresence>
  {formState && (
    <XxxForm
      editId={formState.editId}       // null = create, number = edit
      onClose={() => setFormState(null)}
      onSaved={() => { setFormState(null); fetchData(); }}
    />
  )}
</AnimatePresence>

// Open create:  setFormState({ editId: null })
// Open edit:    setFormState({ editId: row.id })
```

### Drawer animation (Framer Motion)
All form drawers use this exact pattern — slide in from left:
```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Backdrop
<motion.div key="backdrop"
  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
  transition={{ duration: 0.25 }}
  onClick={onClose}
  style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(3px)' }}
/>

// Panel
<motion.div key="panel"
  initial={{ x: -PANEL_W, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: -PANEL_W, opacity: 0 }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: PANEL_W,
    background: '#161618', borderRight: '1px solid rgba(255,255,255,0.07)',
    boxShadow: '8px 0 40px rgba(0,0,0,0.5)', zIndex: 50 }}
/>
```

---

## Design System

All admin UI uses a consistent dark design system. **Use Tailwind CSS utility classes for layout, spacing, and typography. Use inline styles only for dynamic values (colors derived from variables, computed opacities, etc.).**

### Color palette
| Token | Value | Usage |
|---|---|---|
| Page background | `#0D0D0D` / `#111111` | Root bg |
| Surface | `linear-gradient(160deg, #161618, #111113)` | Cards, tables, filter bars |
| Sidebar | `#1c1c1c` | Drawer panel bg |
| Navbar / header | `#1a1a1c` | Panel/drawer headers, sticky footers |
| Border | `rgba(255,255,255,0.07)` | Card/table borders |
| Inner border | `rgba(255,255,255,0.05)` | Row dividers |
| Orange accent | `#FF6B00` / `var(--color-orange)` | CTAs, active states, focus rings |
| Orange dim | `rgba(255,107,0,0.35)` | Hover accents |
| Muted text | `rgba(255,255,255,0.28)` | Subtitles, hints |
| Disabled text | `rgba(255,255,255,0.18)` | Empty states, placeholders |

### Typography
- Page titles: `text-[48px] font-black uppercase tracking-tighter text-white leading-none`
- Section headings: `text-[28px] font-black text-white`
- Column headers: `text-[10px] font-extrabold uppercase tracking-widest` + `rgba(255,255,255,0.25)`
- Body text: `text-[13px]` white or muted
- Badges / labels: `text-[11px] font-bold`

### 3D orange CTA button (the standard "New X" / "Save" button)
```jsx
<button
  className="flex items-center gap-2 px-4 py-3 text-[13px] font-black text-white tracking-wide"
  style={{
    background: 'linear-gradient(135deg, var(--color-orange) 0%, #e05500 100%)',
    boxShadow: '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
    transform: 'translateY(-3px)',
    transition: 'transform 0.08s ease, box-shadow 0.08s ease',
  }}
  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 0 #a33a00, 0 12px 24px rgba(255,107,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
  onMouseDown={e  => { e.currentTarget.style.boxShadow = '0 2px 0 #a33a00, 0 4px 8px rgba(255,107,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0px)'; }}
  onMouseUp={e    => { e.currentTarget.style.boxShadow = '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
>
  <Plus size={15} strokeWidth={3} /> New Item
</button>
```

### Dark input fields (used in drawers)
```jsx
// Focus: orange border + faint glow. Blur: resets.
const inputStyle = {
  width: '100%', padding: '10px 13px',
  background: '#111111', border: '1px solid #2a2a2a',
  borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none',
  caretColor: '#FF6B00', transition: 'border-color .15s, box-shadow .15s',
};
// onFocus: borderColor='rgba(255,107,0,0.5)', boxShadow='0 0 0 3px rgba(255,107,0,0.07)'
// onBlur:  borderColor='#2a2a2a', boxShadow='none'
```

### Filter bar (used in all list pages)
```jsx
<div className="overflow-hidden" style={{ background: 'linear-gradient(160deg,#161618,#111113)', boxShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>
  {/* Orange top accent line */}
  <div className="h-[1.5px] w-full" style={{ background: 'linear-gradient(90deg,rgba(255,107,0,0.6),rgba(255,107,0,0) 60%)' }} />
  {/* Row 1: search input + clear button */}
  {/* Row 2 (optional): filter pills */}
</div>
```

### Filter pills (status / type filters)
```jsx
// Active:   bg=rgba(colorRgb,0.12), border=rgba(colorRgb,0.3), text=rgb(colorRgb), glow
// Inactive: bg=rgba(255,255,255,0.03), border=rgba(255,255,255,0.07), text=rgba(255,255,255,0.35)
// Active pill shows a glowing dot to the left of the label
```

### Dark table (custom grid, replaces DataTable)
```jsx
// Wrapper card
<div style={{ background: 'linear-gradient(160deg,#161618,#111113)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
  {/* Header row */}
  <div style={{ display: 'grid', gridTemplateColumns: '...', height: 40, background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    {/* 10px uppercase tracked muted column labels */}
  </div>
  {/* Data rows — each has a left orange accent bar that appears on hover/select */}
</div>
```

### Row hover accent bar
```jsx
// Inside each row (position: relative):
<div style={{
  position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: '0 2px 2px 0',
  background: hovered ? 'rgba(255,107,0,0.35)' : 'transparent',
  transition: 'background .12s',
}} />
```

### Status / type badges
```jsx
// Generic colored pill:
<span style={{
  display: 'inline-flex', alignItems: 'center', gap: 5,
  padding: '3px 9px', borderRadius: 20,
  background: `rgba(${colorRgb},0.1)`, border: `1px solid rgba(${colorRgb},0.25)`,
  color: `rgb(${colorRgb})`, fontSize: 11, fontWeight: 700,
}}>
  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
  Label
</span>
```

### Toggle switch
```jsx
<button type="button" onClick={() => onChange(!checked)}
  style={{
    position: 'relative', width: 40, height: 24, borderRadius: 12,
    background: checked ? '#FF6B00' : '#2a2a2a',
    border: 'none', cursor: 'pointer',
    boxShadow: checked ? '0 0 12px rgba(255,107,0,0.4)' : 'none',
    transition: 'background .2s',
  }}
>
  <span style={{
    position: 'absolute', top: 4, left: checked ? 20 : 4,
    width: 16, height: 16, borderRadius: '50%', background: '#fff',
    transition: 'left .2s', display: 'block',
  }} />
</button>
```

### Pagination
```jsx
// Wrapper: rounded-2xl, same surface gradient + border as cards
// Active page: bg=rgba(255,107,0,0.16), border=rgba(255,107,0,0.35), glow
// Inactive page: bg=rgba(255,255,255,0.04), border=rgba(255,255,255,0.08)
// Prev/Next: same inactive style, disabled=opacity-20
```

### Drawer panel header
```jsx
// bg #1a1a1c, border-b rgba(255,255,255,0.06)
// Left: 3px orange gradient accent bar + title (15px/800) + subtitle (11px muted)
// Right: X close button (30×30, rounded-lg, rgba white bg)
```

### Drawer sticky footer
```jsx
// bg #1a1a1c, border-t rgba(255,255,255,0.06)
// 3D orange submit button (flex-1) + ghost Cancel button
```

---

## Page-Level Patterns

### List page structure
```
<div className="space-y-5">
  {/* 1. Header: 48px title + subtitle + 3D CTA button */}
  {/* 2. Bulk action bar (if selections exist) */}
  {/* 3. Filter bar (search input + optional filter pills) */}
  {/* 4. Dark table or grid */}
  {/* 5. Pagination */}
  {/* 6. DeleteModal (conditional) */}
  {/* 7. AnimatePresence > XxxForm overlay (conditional) */}
</div>
```

### Drawer form structure
```
AnimatePresence
  ├── Backdrop (fixed, blur, click=close)
  └── Panel (fixed left drawer, slide from x: -PANEL_W)
        ├── Header (title + subtitle + X button)
        ├── Body (scrollable fields with gap-20)
        └── Sticky footer (3D Save + Cancel)
```

### Spinner (loading state)
```jsx
// Inline spinner (no Tailwind animate-spin — use CSS animation directly):
<div style={{ width: 28, height: 28, borderRadius: '50%', border: '2.5px solid #FF6B00', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
```

---

## Tailwind Usage Guidelines

Use **Tailwind utility classes** for:
- Layout: `flex`, `grid`, `space-y-5`, `gap-*`, `items-*`, `justify-*`, `min-w-0`, `overflow-hidden`, `truncate`
- Spacing: `px-*`, `py-*`, `p-*`, `mt-*`, `mb-*`
- Typography: `text-[48px]`, `font-black`, `uppercase`, `tracking-tighter`, `leading-none`, `text-white`, `text-[12px]`
- Responsive: `sm:flex-row`, `lg:hidden`, `md:flex`
- Sizing: `w-full`, `h-*`, `w-8`, `h-8`, `min-h-0`, `flex-1`, `shrink-0`
- Transitions: `transition-all`, `transition-colors`, `duration-150`
- States: `disabled:opacity-20`, `disabled:cursor-not-allowed`
- Borders: `rounded-xl`, `rounded-2xl`, `rounded-lg`, `rounded-full`, `overflow-hidden`

Use **inline styles** only for:
- Dynamic values: colors derived from `colorRgb` variables, computed opacities
- Complex box-shadows (3D button depth floor, glow effects)
- `background: linear-gradient(...)` values
- Exact pixel values not in the Tailwind scale (e.g. `fontSize: 11`, `borderRadius: 20`)
- Mouse event handlers that mutate `e.currentTarget.style` directly

**Do not** use Tailwind for box-shadow, gradient backgrounds, or anything that requires dynamic color interpolation — inline styles are correct there.

---

## Framer Motion

Installed and used throughout the admin. Key patterns:

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Page/form entrance
<motion.div
  initial={{ opacity: 0, y: 20, scale: 0.99 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
/>

// Staggered list items
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }
  }),
};
// Usage: <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">

// Always wrap conditional renders in AnimatePresence for exit animations
<AnimatePresence>
  {condition && <motion.div key="unique" exit={{ opacity: 0 }} />}
</AnimatePresence>
```

The standard easing curve for all transitions is `[0.16, 1, 0.3, 1]` (expo ease-out).
