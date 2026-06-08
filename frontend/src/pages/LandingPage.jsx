import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight, ChevronRight, Shield, Zap, Globe2, CheckCircle2,
  Upload, Brain, FileCheck, Building2, Clock, FileText, Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const LANGUAGES = [
  { code: 'de', name: 'Deutsch',    flag: '🇩🇪' },
  { code: 'tr', name: 'Türkçe',    flag: '🇹🇷' },
  { code: 'ar', name: 'العربية',   flag: '🇸🇦' },
  { code: 'ru', name: 'Русский',   flag: '🇷🇺' },
  { code: 'ku', name: 'Kurdî',     flag: '🏴' },
  { code: 'uk', name: 'Українська',flag: '🇺🇦' },
  { code: 'fa', name: 'فارسی',     flag: '🇮🇷' },
  { code: 'sq', name: 'Shqip',     flag: '🇦🇱' },
  { code: 'sr', name: 'Srpski',    flag: '🇷🇸' },
];

const AUTHORITY_TYPES = [
  'Finanzamt','Jobcenter','Ausländerbehörde','Krankenkasse',
  'Bundesagentur für Arbeit','BAMF','Sozialamt','Amtsgericht',
  'Standesamt','Bürgeramt','Jugendamt','Rentenversicherung',
];

const STEPS = [
  { icon: Upload,    step: 1, key: 'upload'  },
  { icon: Brain,     step: 2, key: 'analyze' },
  { icon: FileCheck, step: 3, key: 'act'     },
];

const TRUST_ITEMS = [
  { icon: Shield,       key: 'secure' },
  { icon: Zap,          key: 'fast'   },
  { icon: Globe2,       key: 'multi'  },
  { icon: CheckCircle2, key: 'free'   },
];

const TESTIMONIALS = [
  { name: 'Yasemin A.', city: 'Stuttgart', lang: '🇹🇷', stars: 5, text: 'Ich habe endlich verstanden, was das Finanzamt von mir will. In zwei Minuten war alles klar – auf Türkisch erklärt. Unglaublich hilfreich!' },
  { name: 'Ahmad K.',   city: 'Berlin',    lang: '🇸🇦', stars: 5, text: 'Ein Brief vom Jobcenter hatte mich wochenlang beschäftigt. Mit BüroBrücke wusste ich sofort, was zu tun ist. Diese App sollte jeder kennen.' },
  { name: 'Olena M.',   city: 'Hamburg',   lang: '🇺🇦', stars: 5, text: 'Nach unserer Ankunft aus der Ukraine bekamen wir viele Briefe von der Ausländerbehörde. BüroBrücke hat uns enorm geholfen.' },
  { name: 'Dmitri P.',  city: 'München',   lang: '🇷🇺', stars: 5, text: 'Der Antwortentwurf war auf Anhieb professionell. Ich musste nur meinen Namen einsetzen und konnte den Brief direkt abschicken.' },
];

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatItem({ value, label, suffix = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 1800, visible);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-extrabold text-white">
        {count.toLocaleString('de-DE')}{suffix}
      </p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}

function MockupCard() {
  return (
    <div className="relative w-full max-w-sm mx-auto animate-float">
      <div className="rounded-2xl border border-border bg-card shadow-card-hover p-5">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="h-10 w-10 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="h-3 w-36 rounded bg-border mb-1.5" />
            <div className="h-2.5 w-24 rounded bg-border/70" />
          </div>
          <span className="badge badge-success text-xs whitespace-nowrap">✓ Analysiert</span>
        </div>
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <span className="text-xs text-slate-500 w-16">Behörde</span>
            <span className="text-sm font-semibold text-white">Finanzamt Berlin</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <span className="text-xs text-slate-500 w-16">Frist</span>
            <span className="badge badge-warning">30. Jan 2025</span>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-surface p-3">
          <p className="text-xs font-semibold text-primary-400 mb-2">Erklärung auf Türkçe</p>
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded bg-border/80" />
            <div className="h-2 w-5/6 rounded bg-border/80" />
            <div className="h-2 w-4/6 rounded bg-border/60" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {[1,2,3].map(n => (
            <div key={n} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold flex-shrink-0">{n}</span>
              <div className="h-2 flex-1 rounded bg-border/60" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -top-4 -right-6 rounded-xl border border-border bg-card shadow-card px-3 py-2">
        <p className="text-xs text-slate-500">Erklärt auf</p>
        <p className="text-sm font-bold text-white">🇹🇷 Türkçe</p>
      </div>
      <div className="absolute -bottom-4 -left-6 rounded-xl border border-danger/40 bg-danger/10 shadow-card px-3 py-2">
        <p className="text-xs font-semibold text-danger">⚠ Frist: 3 Tage</p>
        <p className="text-xs text-danger/70">Sofort handeln</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ documents_analyzed: 0, users_registered: 0, languages_supported: 9 });

  useEffect(() => {
    api.get('/api/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <main className="flex-1">

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-hero-glow" />
        <div className="absolute -top-32 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary-700/10 blur-[100px]" />
        <div className="section-container py-20 md:py-28">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="animate-slide-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300">
                <span className="h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
                {t('landing.badge')}
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-white md:text-5xl xl:text-6xl text-balance">
                {t('landing.title.part1')}{' '}
                <span className="gradient-text">{t('landing.title.highlight')}</span>
                {t('landing.title.part2') ? <> {t('landing.title.part2')}</> : null}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">{t('landing.subtitle')}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to={isAuthenticated ? '/upload' : '/register'} className="btn-primary px-7 py-3 text-base">
                  {t('landing.cta')} <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/demo" className="btn-secondary px-5 py-3 text-base">Live-Demo ansehen</Link>
                {!isAuthenticated && (
                  <Link to="/login" className="btn-ghost text-base text-slate-300">
                    {t('landing.ctaLogin')} <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                {['free','noData','instant'].map(key => (
                  <span key={key} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-success" />{t(`landing.trust_badge.${key}`)}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden lg:block"><MockupCard /></div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="border-y border-border bg-card/30">
        <div className="section-container py-12">
          <div className="grid grid-cols-3 gap-8 divide-x divide-border">
            <StatItem value={stats.documents_analyzed} suffix="+" label="Briefe analysiert" />
            <StatItem value={stats.users_registered} suffix="+" label="Registrierte Nutzer" />
            <StatItem value={stats.languages_supported} label="Unterstützte Sprachen" />
          </div>
        </div>
      </section>

      {/* ═══ LANGUAGES ═══ */}
      <section className="border-b border-border bg-surface-2/60">
        <div className="section-container py-10">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
            {t('landing.languages.label')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {LANGUAGES.map(lang => (
              <div key={lang.code} className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-primary-500/40 hover:bg-card-2">
                <span className="text-lg leading-none">{lang.flag}</span>{lang.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section-container py-24">
        <div className="mb-16 text-center">
          <div className="badge badge-primary mx-auto mb-4">{t('landing.steps.eyebrow')}</div>
          <h2 className="section-title">{t('landing.steps.title')}</h2>
          <p className="section-subtitle mx-auto max-w-2xl">{t('landing.steps.subtitle')}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, step, key }, idx) => (
            <div key={key} className="relative text-center">
              {idx < STEPS.length - 1 && (
                <div className="absolute top-8 left-[60%] hidden h-px w-4/5 bg-gradient-to-r from-primary-500/50 to-transparent md:block" />
              )}
              <div className="relative mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-500/25 bg-primary-500/10">
                <Icon className="h-7 w-7 text-primary-400" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white shadow-glow">{step}</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{t(`landing.steps.${key}.title`)}</h3>
              <p className="leading-relaxed text-slate-400">{t(`landing.steps.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ AUTHORITIES ═══ */}
      <section className="border-y border-border bg-surface-2/40">
        <div className="section-container py-12">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
            {t('landing.authorities.label')}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {AUTHORITY_TYPES.map(auth => (
              <span key={auth} className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-slate-300 transition hover:border-primary-500/30 hover:text-slate-100">{auth}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST ═══ */}
      <section className="section-container py-24">
        <div className="mb-16 text-center">
          <h2 className="section-title">{t('landing.trust.title')}</h2>
          <p className="section-subtitle mx-auto max-w-xl">{t('landing.trust.subtitle')}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map(({ icon: Icon, key }) => (
            <div key={key} className="card-hover text-center group">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-500/20 bg-primary-500/10 transition group-hover:bg-primary-500/15">
                <Icon className="h-6 w-6 text-primary-400" />
              </div>
              <h3 className="mb-1.5 font-bold text-white">{t(`landing.trust.${key}.title`)}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{t(`landing.trust.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="border-y border-border bg-surface-2/40">
        <div className="section-container py-20">
          <div className="mb-12 text-center">
            <h2 className="section-title">Was Nutzer sagen</h2>
            <p className="section-subtitle">Echte Erfahrungen aus der Community.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card-base flex flex-col">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-300 flex-1 italic">„{t.text}"</p>
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                  <span className="text-lg">{t.lang}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="border-t border-border">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface to-surface-2" />
          <div className="absolute inset-0 -z-10 bg-hero-glow opacity-60" />
          <div className="section-container py-24 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl text-balance">
              {t('landing.finalCta.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">{t('landing.finalCta.subtitle')}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to={isAuthenticated ? '/upload' : '/register'} className="btn-primary px-8 py-3.5 text-base">
                {t('landing.cta')} <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/demo" className="btn-secondary px-6 py-3.5 text-base">Live-Demo ansehen</Link>
            </div>
            <p className="mt-5 text-sm text-slate-600">{t('landing.finalCta.hint')}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
