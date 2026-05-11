import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, FileText, Upload as UploadIcon, Languages } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { SUPPORTED_LANGUAGES } from '../../i18n';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout, updateLanguage } = useAuth();
  const navigate = useNavigate();

  const handleLanguageChange = async (event) => {
    const lang = event.target.value;
    if (isAuthenticated) {
      try {
        await updateLanguage(lang);
      } catch {
        i18n.changeLanguage(lang);
      }
    } else {
      i18n.changeLanguage(lang);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentLanguage = user?.preferred_language || i18n.language || 'de';

  return (
    <header className="border-b border-slate-800 bg-surface/90 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-500 text-white">B</span>
          {t('app.name')}
        </Link>

        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `btn-ghost ${isActive ? 'bg-slate-800 text-white' : ''}`
                }
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.dashboard')}</span>
              </NavLink>
              <NavLink
                to="/upload"
                className={({ isActive }) =>
                  `btn-ghost ${isActive ? 'bg-slate-800 text-white' : ''}`
                }
              >
                <UploadIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.upload')}</span>
              </NavLink>
            </>
          ) : null}

          <div className="relative">
            <Languages className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={currentLanguage}
              onChange={handleLanguageChange}
              className="rounded-lg border border-slate-700 bg-card py-2 pl-8 pr-3 text-sm text-slate-100 focus:border-primary-500 focus:outline-none"
              aria-label="Language"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {isAuthenticated ? (
            <button type="button" onClick={handleLogout} className="btn-ghost" aria-label={t('nav.logout')}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t('nav.logout')}</span>
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                {t('nav.login')}
              </Link>
              <Link to="/register" className="btn-primary">
                {t('nav.register')}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
