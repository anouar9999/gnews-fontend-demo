import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

// null  = still loading
// {}    = loaded (may be empty if fetch failed)
const Ctx = createContext(null);

export function LandingSectionsProvider({ children }) {
  const [sections, setSections] = useState(null);

  useEffect(() => {
    api.get('/landing-sections/')
      .then(({ data }) => {
        const map = {};
        (data.results ?? data).forEach(s => { map[s.key] = s; });
        setSections(map);
      })
      .catch(() => setSections({})); // failed → treat as empty (fall back to defaults)
  }, []);

  return <Ctx.Provider value={sections}>{children}</Ctx.Provider>;
}

/**
 * Returns the admin config for one landing section.
 *   undefined → still loading (context not ready)
 *   null      → loaded but key not found
 *   object    → the section config
 *
 * Shape: { key, label, category, category_slug, article_count, is_active,
 *           articles: [{ article: {...ArticleListSerializer...}, position }] }
 */
export function useLandingSection(key) {
  const sections = useContext(Ctx);
  if (sections === null) return undefined; // loading
  return sections[key] ?? null;
}
