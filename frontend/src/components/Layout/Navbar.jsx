import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, FileText, Upload as UploadIcon, Menu, X, ChevronDown } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { SUPPORTED_LANGUAGES } from '../../i18n';

function BridgeLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#4F6EF7" />
      <path
        d="M4 22 Q16 10 28 22"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="9"  y1="22" x2="9"  y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="23" y1="22" x2="23" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="4"  y1="22" x2="28" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LanguageSelector({ currentLanguage, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-xl border border-border bg-card/80 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-card-2 hover:border-primary-500/40"
        aria-label="Sprache wechseln"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-border bg-card shadow-card-hover animate-slide-up">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => { onChange(lang.code); setOpen(false); }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition first:rounded-t-xl last:rounded-b-xl
                ${lang.code === currentLanguage
                  ? 'bg-primary-500/15 text-primary-300 font-semibold'
                  : 'text-slate-300 hover:bg-card-2 hover:text-white'}`}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout, updateLanguage } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLanguage = user?.preferred_language || i18n.language || 'de';

  const handleLanguageChange = async (lang) => {
    if (isAuthenticated) {
      try { await updateLanguage(lang); } catch { i18n.changeLanguage(lang); }
    } else {
      i18n.changeLanguage(lang);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinkClass = ({ isActive }) =>
    `btn-ghost text-sm ${isActive ? 'bg-card text-white' : ''}`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="section-container">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <Link
              to="/"
              className="flex items-center gap-2.5 font-bold text-white transition hover:opacity-90"
              onClick={() => setMobileOpen(false)}
            >
              <BridgeLogo />
              <span className="text-lg tracking-tight">
                Büro<span className="text-primary-400">Brücke</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <FileText className="h-4 w-4" />
                    {t('nav.dashboard')}
                  </NavLink>
                  <NavLink to="/upload" className={navLinkClass}>
                    <UploadIcon className="h-4 w-4" />
                    {t('nav.upload')}
                  </NavLink>
                </>
              ) : (
                <NavLink to="/about" className={navLinkClass}>
                  {t('nav.about')}
                </NavLink>
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <LanguageSelector currentLanguage={currentLanguage} onChange={handleLanguageChange} />

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden btn-ghost text-sm text-slate-400 hover:text-danger md:inline-flex"
                  aria-label={t('nav.logout')}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">{t('nav.logout')}</span>
                </button>
              ) : (
                <div className="hidden items-center gap-2 md:flex">
                  <Link to="/login" className="btn-ghost text-sm">
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="btn-primary text-sm px-4 py-2">
                    {t('nav.register')}
                  </Link>
                </div>
              )}

              {/* Mobile burger */}
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="btn-ghost p-2 md:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-16 bottom-0 w-72 animate-slide-in-right border-l border-border bg-surface shadow-card-hover">
            <nav className="flex flex-col gap-1 p-4">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className={navLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    <FileText className="h-4 w-4" />
                    {t('nav.dashboard')}
                  </NavLink>
                  <NavLink
                    to="/upload"
                    className={navLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    <UploadIcon className="h-4 w-4" />
                    {t('nav.upload')}
                  </NavLink>
                  <div className="my-2 border-t border-border" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn-ghost text-sm justify-start text-slate-400 hover:text-danger"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/about"
                    className={navLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t('nav.about')}
                  </NavLink>
                  <div className="my-2 border-t border-border" />
                  <Link
                    to="/login"
                    className="btn-ghost text-sm justify-start"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-sm mt-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
