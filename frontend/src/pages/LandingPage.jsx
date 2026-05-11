import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Camera, Languages, ListChecks, ArrowRight } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const FEATURE_KEYS = [
  { key: 'photo', icon: Camera },
  { key: 'explain', icon: Languages },
  { key: 'act', icon: ListChecks },
];

export default function LandingPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-700/20 via-surface to-surface" />
        <div className="mx-auto max-w-5xl px-4 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-card/80 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
            {t('app.tagline')}
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
            {t('landing.title')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300 md:text-xl">
            {t('landing.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to={isAuthenticated ? '/upload' : '/register'} className="btn-primary text-base">
              {t('landing.cta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {!isAuthenticated ? (
              <Link to="/login" className="btn-secondary text-base">
                {t('landing.ctaLogin')}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURE_KEYS.map(({ key, icon: Icon }) => (
            <article key={key} className="card-base">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-500/15 text-primary-500">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {t(`landing.features.${key}.title`)}
              </h3>
              <p className="mt-2 text-slate-300">{t(`landing.features.${key}.desc`)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
