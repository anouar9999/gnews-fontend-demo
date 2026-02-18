import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute, { AdminRoute } from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ArticleList from './pages/articles/ArticleList';
import ArticleForm from './pages/articles/ArticleForm';
import CategoryList from './pages/categories/CategoryList';
import CategoryForm from './pages/categories/CategoryForm';
import TagList from './pages/tags/TagList';
import TagForm from './pages/tags/TagForm';
import SourceList from './pages/sources/SourceList';
import SourceForm from './pages/sources/SourceForm';
import MediaList from './pages/media/MediaList';
import MediaForm from './pages/media/MediaForm';
import RawNewsList from './pages/raw-news/RawNewsList';
import RawNewsForm from './pages/raw-news/RawNewsForm';
import UserList from './pages/users/UserList';
import UserForm from './pages/users/UserForm';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="articles" element={<ArticleList />} />
            <Route path="articles/new" element={<ArticleForm />} />
            <Route path="articles/:id/edit" element={<ArticleForm />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/:id/edit" element={<CategoryForm />} />
            <Route path="tags" element={<TagList />} />
            <Route path="tags/new" element={<TagForm />} />
            <Route path="tags/:id/edit" element={<TagForm />} />
            {/* Admin-only routes */}
            <Route path="sources" element={<AdminRoute><SourceList /></AdminRoute>} />
            <Route path="sources/new" element={<AdminRoute><SourceForm /></AdminRoute>} />
            <Route path="sources/:id/edit" element={<AdminRoute><SourceForm /></AdminRoute>} />
            <Route path="media" element={<AdminRoute><MediaList /></AdminRoute>} />
            <Route path="media/new" element={<AdminRoute><MediaForm /></AdminRoute>} />
            <Route path="media/:id/edit" element={<AdminRoute><MediaForm /></AdminRoute>} />
            <Route path="raw-news" element={<AdminRoute><RawNewsList /></AdminRoute>} />
            <Route path="raw-news/new" element={<AdminRoute><RawNewsForm /></AdminRoute>} />
            <Route path="raw-news/:id/edit" element={<AdminRoute><RawNewsForm /></AdminRoute>} />
            <Route path="users" element={<AdminRoute><UserList /></AdminRoute>} />
            <Route path="users/new" element={<AdminRoute><UserForm /></AdminRoute>} />
            <Route path="users/:id/edit" element={<AdminRoute><UserForm /></AdminRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
