import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AdminLayout        from './layouts/AdminLayout';
import AdminPreviewLayout from './layouts/AdminPreviewLayout';
import GnewzLayout        from './layouts/GnewzLayout';

// Admin pages
import AdminLogin      from './pages/admin/AdminLogin';
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminSettings   from './pages/admin/AdminSettings';

// Existing admin CRUD pages
import ArticleList  from './pages/articles/ArticleList';
import ArticleForm  from './pages/articles/ArticleForm';
import CategoryList from './pages/categories/CategoryList';
import CategoryForm from './pages/categories/CategoryForm';
import TagList      from './pages/tags/TagList';
import TagForm      from './pages/tags/TagForm';
import SourceList   from './pages/sources/SourceList';
import SourceForm   from './pages/sources/SourceForm';
import MediaList    from './pages/media/MediaList';
import MediaForm    from './pages/media/MediaForm';
import RawNewsList  from './pages/raw-news/RawNewsList';
import RawNewsForm  from './pages/raw-news/RawNewsForm';
import UserList     from './pages/users/UserList';
import UserForm     from './pages/users/UserForm';

// Public GNEWZ pages
import LandingPage  from './pages/public/LandingPage';
import GamingPage   from './pages/public/GamingPage';
import HardwarePage from './pages/public/HardwarePage';
import CulturePage  from './pages/public/CulturePage';
import EsportPage   from './pages/public/EsportPage';
import SearchPage   from './pages/public/SearchPage';

export default function App() {
  return (
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
            <Route path="search"   element={<SearchPage />} />
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
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="settings"  element={<AdminSettings />} />

            <Route path="articles"          element={<ArticleList />} />
            <Route path="articles/new"      element={<ArticleForm />} />
            <Route path="articles/:id/edit" element={<ArticleForm />} />

            <Route path="categories"          element={<CategoryList />} />
            <Route path="categories/new"      element={<CategoryForm />} />
            <Route path="categories/:id/edit" element={<CategoryForm />} />

            <Route path="tags"          element={<TagList />} />
            <Route path="tags/new"      element={<TagForm />} />
            <Route path="tags/:id/edit" element={<TagForm />} />

            <Route path="sources"          element={<SourceList />} />
            <Route path="sources/new"      element={<SourceForm />} />
            <Route path="sources/:id/edit" element={<SourceForm />} />

            <Route path="media"          element={<MediaList />} />
            <Route path="media/new"      element={<MediaForm />} />
            <Route path="media/:id/edit" element={<MediaForm />} />

            <Route path="raw-news"          element={<RawNewsList />} />
            <Route path="raw-news/new"      element={<RawNewsForm />} />
            <Route path="raw-news/:id/edit" element={<RawNewsForm />} />

            <Route path="users"          element={<UserList />} />
            <Route path="users/new"      element={<UserForm />} />
            <Route path="users/:id/edit" element={<UserForm />} />
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
  );
}
