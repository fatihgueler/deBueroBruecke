import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Spinner from './components/UI/Spinner';
import { useAuth } from './context/AuthContext';

import LandingPage     from './pages/LandingPage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import DashboardPage   from './pages/DashboardPage';
import UploadPage      from './pages/UploadPage';
import ResultPage      from './pages/ResultPage';
import AboutPage       from './pages/AboutPage';
import ImpressumPage   from './pages/ImpressumPage';
import DatenschutzPage from './pages/DatenschutzPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function NotFoundPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-24 text-center">
      <div>
        <p className="text-7xl font-extrabold text-primary-500">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white">Seite nicht gefunden</h1>
        <p className="mt-2 text-slate-400">Diese Seite existiert nicht.</p>
        <a href="/" className="btn-primary mt-8 inline-flex">Zur Startseite</a>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-slate-100">
      <Navbar />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background:    '#152035',
            color:         '#f1f5f9',
            border:        '1px solid #1e3050',
            borderRadius:  '12px',
            fontSize:      '14px',
            padding:       '12px 16px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#0b1425' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#0b1425' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/"            element={<LandingPage />}     />
        <Route path="/about"       element={<AboutPage />}       />
        <Route path="/impressum"   element={<ImpressumPage />}   />
        <Route path="/datenschutz" element={<DatenschutzPage />} />

        {/* Auth-only public */}
        <Route
          path="/login"
          element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>}
        />
        <Route
          path="/register"
          element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>}
        />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/upload"
          element={<ProtectedRoute><UploadPage /></ProtectedRoute>}
        />
        <Route
          path="/result/:documentId"
          element={<ProtectedRoute><ResultPage /></ProtectedRoute>}
        />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
