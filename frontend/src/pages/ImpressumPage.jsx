import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';

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

          {/* Gründer & Entwickler */}
          <section className="card-base">
            <h2 className="text-lg font-bold text-white mb-4">{t('impressum.developer')}</h2>
            <div className="space-y-1 text-sm">
              <p className="text-xl font-bold text-white">Fatih Mehmet Han Güler</p>
              <p className="text-primary-400 font-medium">Gründer &amp; Entwickler von BüroBrücke</p>
            </div>
          </section>

          {/* Die Geschichte hinter BüroBrücke */}
          <section className="rounded-2xl border border-primary-500/20 bg-primary-500/5 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Heart className="h-5 w-5 text-primary-400 fill-primary-400/30" />
              <h2 className="text-lg font-bold text-white">Die Geschichte hinter BüroBrücke</h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-slate-300">
              <p>
                BüroBrücke ist kein Produkt, das in einer Ideenrunde entstand. Es ist die Antwort auf eine
                Kindheit, die ich nie vergessen werde.
              </p>
              <p>
                Ich bin mit Migrationshintergrund in Deutschland aufgewachsen. Schon im Alter von neun Jahren
                war ich die Person in meiner Familie, die Behördenbriefe las, übersetzte und erklärte. Briefe
                vom Finanzamt, vom Jobcenter, von der Ausländerbehörde — Schreiben, die Erwachsene in Angst
                versetzt haben. Schreiben, die ich als Kind entschlüsseln musste, ohne wirklich zu verstehen,
                was auf dem Spiel stand.
              </p>
              <p>
                Kein Kind sollte diesen Druck kennen. Die Last, der Anker der eigenen Familie zu sein, wenn man
                selbst noch lernt, die Welt zu begreifen. Der stille Stress, einen Fehler zu machen — einen
                Fehler, der Konsequenzen haben könnte, die weit über die eigene Kindheit hinausgehen. Dieses
                Gefühl saß tief, und es hat mich nie ganz losgelassen.
              </p>
              <p>
                Jahre später, als Entwickler, habe ich BüroBrücke gebaut — nicht für eine Zielgruppe, sondern
                für das Kind, das ich einmal war. Und für alle, die heute noch in dieser Situation stecken.
                Damit kein Mensch allein vor einem Brief sitzt und nicht weiß, was er bedeutet. Damit kein Kind
                mehr diese Verantwortung tragen muss.
              </p>
              <p className="text-slate-400 italic">
                Diese Plattform ist mein Beitrag. Aus Erfahrung. Aus Überzeugung. Aus dem Herzen.
              </p>
              <p className="pt-2 font-semibold text-white">
                — Fatih Mehmet Han Güler
              </p>
            </div>
          </section>

          {/* Kontakt */}
          <section className="card-base">
            <h2 className="text-lg font-bold text-white mb-4">{t('impressum.contact')}</h2>
            <div className="space-y-1.5 text-slate-400 text-sm">
              <p>Für Anfragen, Feedback oder Datenschutzanliegen:</p>
              <p className="text-primary-400 font-medium">kontakt@buerobruecke.de</p>
            </div>
          </section>

          {/* Haftungsausschluss */}
          <section className="card-base">
            <h2 className="text-lg font-bold text-white mb-4">{t('impressum.disclaimer.title')}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('impressum.disclaimer.content')}
            </p>
          </section>

          {/* Technologie */}
          <section className="card-base">
            <h2 className="text-lg font-bold text-white mb-4">{t('impressum.tech.title')}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('impressum.tech.content')}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['FastAPI', 'React', 'Claude AI by Anthropic', 'Tesseract OCR', 'SQLite'].map((tech) => (
                <span key={tech} className="badge badge-neutral">{tech}</span>
              ))}
            </div>
          </section>

          {/* Haftung für Links */}
          <section className="card-base">
            <h2 className="text-lg font-bold text-white mb-4">Haftung für Links</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
              verantwortlich.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
