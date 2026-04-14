import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PageTitleProvider } from './context/PageTitleContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AdminLayout        from './layouts/AdminLayout';
import AdminPreviewLayout from './layouts/AdminPreviewLayout';
import GnewzLayout        from './layouts/GnewzLayout';

// Admin pages
import AdminLogin      from './pages/admin/AdminLogin';
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminSettings   from './pages/admin/AdminSettings';
import AnalyticsPage   from './pages/admin/AnalyticsPage';
import SitePagesAdmin  from './pages/admin/SitePagesAdmin';

// Existing admin CRUD pages
import ArticleList   from './pages/articles/ArticleList';
import ArticleForm   from './pages/articles/ArticleForm';
import ArticleDetail from './pages/articles/ArticleDetail';
import CategoryList from './pages/categories/CategoryList';
import TagList      from './pages/tags/TagList';
import SourceList   from './pages/sources/SourceList';
import MediaList    from './pages/media/MediaList';
import RawNewsList  from './pages/raw-news/RawNewsList';
import UserList     from './pages/users/UserList';

// Public GNEWZ pages
import LandingPage  from './pages/public/LandingPage';
import GamingPage   from './pages/public/GamingPage';
import HardwarePage from './pages/public/HardwarePage';
import CulturePage  from './pages/public/CulturePage';
import EsportPage   from './pages/public/EsportPage';
import SearchPage            from './pages/public/SearchPage';
import PublicArticleDetail   from './pages/public/PublicArticleDetail';
import AboutPage        from './pages/public/AboutPage';
import ContactPage      from './pages/public/ContactPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import TermsOfUsePage   from './pages/public/TermsOfUsePage';
import CookiePolicyPage from './pages/public/CookiePolicyPage';

export default function App() {
  return (
    <PageTitleProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public GNEWZ Frontend ── */}
          <Route element={<GnewzLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="gaming"   element={<GamingPage />} />
            <Route path="hardware" element={<HardwarePage />} />
            <Route path="culture"  element={<CulturePage />} />
            <Route path="esports"  element={<EsportPage />} />
            <Route path="search"          element={<SearchPage />} />
            <Route path="articles/:slug"  element={<PublicArticleDetail />} />
            <Route path="about"           element={<AboutPage />} />
            <Route path="contact"         element={<ContactPage />} />
            <Route path="privacy-policy"  element={<PrivacyPolicyPage />} />
            <Route path="terms-of-use"    element={<TermsOfUsePage />} />
            <Route path="cookie-policy"   element={<CookiePolicyPage />} />
          </Route>

          {/* ── Admin Login (public) ── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ── Admin Preview Site at /admin (protected) ── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPreviewLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<LandingPage />} />
            <Route path="gaming"   element={<GamingPage />} />
            <Route path="hardware" element={<HardwarePage />} />
            <Route path="culture"  element={<CulturePage />} />
            <Route path="esports"  element={<EsportPage />} />
            <Route path="search"   element={<SearchPage />} />
          </Route>

          {/* ── Admin CMS (protected) ── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard"  element={<AdminDashboard />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings"  element={<AdminSettings />} />

            <Route path="articles"          element={<ArticleList />} />
            <Route path="articles/new"      element={<ArticleForm />} />
            <Route path="articles/:id"      element={<ArticleDetail />} />
            <Route path="articles/:id/edit" element={<ArticleForm />} />

            <Route path="categories" element={<CategoryList />} />

            <Route path="tags" element={<TagList />} />

            <Route path="sources" element={<SourceList />} />

            <Route path="media" element={<MediaList />} />

            <Route path="raw-news" element={<RawNewsList />} />

            <Route path="users" element={<UserList />} />

            <Route path="site-pages" element={<SitePagesAdmin />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1A1A1A', color: '#fff', border: '1px solid #333' },
        }}
      />
    </AuthProvider>
    </PageTitleProvider>
  );
}
