import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const SECTIONS = ['data', 'usage', 'deletion', 'cookies'];

export default function DatenschutzPage() {
  const { t } = useTranslation();

  return (
    <main className="flex-1">
      <div className="section-container py-16 max-w-3xl">
        <Link to="/" className="btn-ghost mb-8 inline-flex">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-success/10 border border-success/25 flex items-center justify-center">
            <Shield className="h-5 w-5 text-success" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t('datenschutz.title')}</h1>
        </div>
        <p className="text-slate-400 mb-2 text-sm">Zuletzt aktualisiert: Januar 2025</p>

        <div className="mt-6 card-base mb-8">
          <p className="text-slate-300 leading-relaxed">{t('datenschutz.intro')}</p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((key) => (
            <section key={key} className="card-base">
              <h2 className="text-lg font-bold text-white mb-3">
                {t(`datenschutz.sections.${key}.title`)}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t(`datenschutz.sections.${key}.content`)}
              </p>
            </section>
          ))}

          <section className="card-base">
            <h2 className="text-lg font-bold text-white mb-3">Kontakt bei Datenschutzfragen</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Bei Fragen zum Datenschutz kannst du uns jederzeit kontaktieren:
            </p>
            <p className="mt-3 text-primary-400 font-medium text-sm">datenschutz@buerobruecke.de</p>
          </section>

          <div className="rounded-xl border border-success/25 bg-success/5 p-5">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-success">Unser Versprechen:</strong> Wir verdienen kein Geld mit deinen Daten.
                BüroBrücke ist ein gemeinnütziges Projekt – deine Dokumente gehören dir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
