import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Heart } from 'lucide-react';

function BridgeLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#4F6EF7" />
      <path d="M4 22 Q16 10 28 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="9"  y1="22" x2="9"  y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="23" y1="22" x2="23" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="4"  y1="22" x2="28" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const COL_PRODUCT = [
  { to: '/',        label: 'Startseite'   },
  { to: '/demo',    label: 'Live-Demo'    },
  { to: '/about',   label: 'Über uns'     },
  { to: '/glossar', label: 'Glossar'      },
  { to: '/faq',     label: 'FAQ'          },
];

const COL_FUER_ORGS = [
  { to: '/ngo',     label: 'Für NGOs & Behörden' },
  { to: '/presse',  label: 'Pressebereich'        },
];

const COL_LEGAL = [
  { to: '/impressum',   label: 'Impressum'      },
  { to: '/datenschutz', label: 'Datenschutz'    },
];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface no-print">
      <div className="section-container py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand – 2 cols */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-white">
              <BridgeLogo />
              <span className="text-lg tracking-tight">Büro<span className="text-primary-400">Brücke</span></span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              {t('footer.tagline')}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-600">
              <Shield className="h-3.5 w-3.5" />{t('footer.disclaimer')}
            </div>
          </div>

          {/* Produkt */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Produkt</h3>
            <ul className="space-y-2.5">
              {COL_PRODUCT.map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-sm text-slate-500 transition hover:text-slate-200">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Für Organisationen */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Organisationen</h3>
            <ul className="space-y-2.5">
              {COL_FUER_ORGS.map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-sm text-slate-500 transition hover:text-slate-200">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Rechtliches</h3>
            <ul className="space-y-2.5">
              {COL_LEGAL.map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-sm text-slate-500 transition hover:text-slate-200">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-slate-600">© {year} BüroBrücke · {t('footer.rights_short')}</p>
          <p className="flex items-center gap-1.5 text-xs text-slate-600">
            {t('footer.madeWith')} <Heart className="h-3.5 w-3.5 text-danger fill-danger" /> {t('footer.forImmigrants')}
          </p>
        </div>
      </div>
    </footer>
  );
}
