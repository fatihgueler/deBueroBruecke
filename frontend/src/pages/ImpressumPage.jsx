import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ImpressumPage() {
  const { t } = useTranslation();

  return (
    <main className="flex-1">
      <div className="section-container py-16 max-w-3xl">
        <Link to="/" className="btn-ghost mb-8 inline-flex">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>

        <h1 className="text-3xl font-extrabold text-white mb-2">{t('impressum.title')}</h1>
        <p className="text-slate-500 mb-10 text-sm">Angaben gemäß § 5 TMG</p>

        <div className="space-y-8">
          <section className="card-base">
            <h2 className="text-lg font-bold text-white mb-4">{t('impressum.developer')}</h2>
            <div className="space-y-1.5 text-slate-400 text-sm">
              <p className="font-semibold text-slate-200">BüroBrücke</p>
              <p>Ein Projekt zur Unterstützung von Einwanderern und Geflüchteten in Deutschland</p>
              <p className="mt-3 text-slate-500">
                BüroBrücke ist ein gemeinnütziges Softwareprojekt, das keine kommerziellen Zwecke verfolgt.
              </p>
            </div>
          </section>

          <section className="card-base">
            <h2 className="text-lg font-bold text-white mb-4">{t('impressum.contact')}</h2>
            <div className="space-y-1.5 text-slate-400 text-sm">
              <p>Für Anfragen, Feedback oder Datenschutzanliegen:</p>
              <p className="text-primary-400 font-medium">kontakt@buerobruecke.de</p>
            </div>
          </section>

          <section className="card-base">
            <h2 className="text-lg font-bold text-white mb-4">{t('impressum.disclaimer.title')}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('impressum.disclaimer.content')}
            </p>
          </section>

          <section className="card-base">
            <h2 className="text-lg font-bold text-white mb-4">{t('impressum.tech.title')}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('impressum.tech.content')}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['FastAPI', 'React', 'Claude AI by Anthropic', 'Tesseract OCR', 'PostgreSQL/SQLite'].map((tech) => (
                <span key={tech} className="badge badge-neutral">{tech}</span>
              ))}
            </div>
          </section>

          <section className="card-base">
            <h2 className="text-lg font-bold text-white mb-4">Haftung für Links</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
              Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
