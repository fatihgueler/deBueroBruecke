import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Globe2, Shield, Zap, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LANGUAGES = [
  { name: 'Deutsch',      flag: '🇩🇪' },
  { name: 'Türkçe',       flag: '🇹🇷' },
  { name: 'العربية',      flag: '🇸🇦' },
  { name: 'Русский',      flag: '🇷🇺' },
  { name: 'Kurdî',        flag: '🏴' },
  { name: 'Українська',   flag: '🇺🇦' },
];

const VALUES = [
  { icon: Globe2,  key: 'accessible' },
  { icon: Shield,  key: 'privacy'    },
  { icon: Zap,     key: 'accuracy'   },
  { icon: Users,   key: 'inclusive'  },
];

export default function AboutPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <main className="flex-1">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-hero-glow" />
        <div className="section-container py-20 text-center">
          <div className="badge badge-primary mx-auto mb-5">BüroBrücke</div>
          <h1 className="section-title">{t('about.title')}</h1>
          <p className="section-subtitle mx-auto max-w-2xl">{t('about.subtitle')}</p>
        </div>
      </section>

      {/* Mission + Problem + Solution */}
      <section className="section-container py-20">
        <div className="grid gap-10 lg:grid-cols-3">
          {['mission', 'problem', 'solution'].map((key) => (
            <div key={key} className="card-base">
              <h2 className="mb-3 text-xl font-bold text-white">{t(`about.${key}.title`)}</h2>
              <p className="leading-relaxed text-slate-400">{t(`about.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section className="border-y border-border bg-surface-2/40">
        <div className="section-container py-16 text-center">
          <h2 className="section-title mb-3">{t('about.languages.title')}</h2>
          <p className="section-subtitle mx-auto max-w-2xl mb-10">{t('about.languages.desc')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {LANGUAGES.map((lang) => (
              <div
                key={lang.name}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-5 py-3 text-base font-medium text-slate-200"
              >
                <span className="text-xl">{lang.flag}</span>
                {lang.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-container py-20">
        <div className="mb-14 text-center">
          <h2 className="section-title">Unsere Werte</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, key }) => (
            <div key={key} className="card-hover text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 border border-primary-500/20">
                <Icon className="h-6 w-6 text-primary-400" />
              </div>
              <h3 className="mb-1.5 font-bold text-white">
                {key === 'accessible' ? 'Zugänglichkeit' :
                 key === 'privacy'    ? 'Datenschutz'    :
                 key === 'accuracy'   ? 'Genauigkeit'    : 'Inklusion'}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {key === 'accessible' ? 'Jeder Mensch verdient das Recht, offizielle Dokumente zu verstehen, unabhängig von Sprachkenntnissen.' :
                 key === 'privacy'    ? 'Wir behandeln deine Dokumente vertraulich und geben keine Daten an Dritte weiter.' :
                 key === 'accuracy'   ? 'Unsere KI analysiert präzise und gibt klare, handlungsorientierte Empfehlungen.' :
                                        'BüroBrücke steht für alle Menschen – unabhängig von Herkunft und Sprachkenntnissen.'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-surface-2/30">
        <div className="section-container py-20 text-center">
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            Jetzt kostenlos starten
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            Lade deinen ersten Behördenbrief hoch und erlebe, wie einfach Verstehen sein kann.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to={isAuthenticated ? '/upload' : '/register'}
              className="btn-primary px-8 py-3.5 text-base"
            >
              {isAuthenticated ? 'Brief hochladen' : 'Kostenlos registrieren'}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
