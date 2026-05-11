import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Linkedin, Mail, ExternalLink, Code2, Globe } from 'lucide-react';

function LinkedInButton() {
  return (
    <a
      href="https://www.linkedin.com/in/fatih-güler-0206a639a/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-xl border border-[#0A66C2]/40 bg-[#0A66C2]/10 px-5 py-2.5 text-sm font-semibold text-[#5ba4e5] transition-all hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/60 hover:text-white"
    >
      <Linkedin className="h-4 w-4" />
      LinkedIn – Fatih Mehmet Han Güler
      <ExternalLink className="h-3.5 w-3.5 opacity-60" />
    </a>
  );
}

function StorySection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-500/8 via-card to-card p-8">
      {/* Deko-Glanz oben rechts */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/15 border border-primary-500/25">
            <Heart className="h-5 w-5 text-primary-400 fill-primary-400/25" />
          </div>
          <h2 className="text-xl font-bold text-white">Die Geschichte hinter BüroBrücke</h2>
        </div>

        <div className="space-y-5 text-sm leading-7 text-slate-300">
          <p>
            BüroBrücke ist kein Produkt, das in einer Ideenrunde entstand. Es ist die Antwort
            auf eine Kindheit, die ich nie vergessen werde.
          </p>

          <p>
            Ich bin mit Migrationshintergrund in Deutschland aufgewachsen. Schon im Alter von{' '}
            <span className="font-semibold text-white">neun Jahren</span> war ich die Person in
            meiner Familie, die Behördenbriefe las, übersetzte und erklärte. Briefe vom
            Finanzamt, vom Jobcenter, von der Ausländerbehörde — Schreiben, die Erwachsene in
            Angst versetzt haben. Schreiben, die ich als Kind entschlüsseln musste, ohne wirklich
            zu verstehen, was auf dem Spiel stand.
          </p>

          {/* Pull-Quote */}
          <blockquote className="my-6 border-l-2 border-primary-500/60 pl-5 text-base italic text-slate-200 leading-8">
            „Kein Kind sollte diesen Druck kennen. Die Last, der Anker der eigenen Familie zu
            sein, wenn man selbst noch lernt, die Welt zu begreifen."
          </blockquote>

          <p>
            Der stille Stress, einen Fehler zu machen — einen Fehler, der Konsequenzen haben
            könnte, die weit über die eigene Kindheit hinausgehen. Dieses Gefühl saß tief, und
            es hat mich nie ganz losgelassen.
          </p>

          <p>
            Jahre später, als Entwickler, habe ich BüroBrücke gebaut — nicht für eine
            Zielgruppe, sondern für das Kind, das ich einmal war. Und für alle, die heute noch
            in dieser Situation stecken. Damit kein Mensch allein vor einem Brief sitzt und
            nicht weiß, was er bedeutet. Damit{' '}
            <span className="font-semibold text-white">
              kein Kind mehr diese Verantwortung tragen muss.
            </span>
          </p>

          <p className="text-slate-400 italic">
            Diese Plattform ist mein Beitrag. Aus Erfahrung. Aus Überzeugung. Aus dem Herzen.
          </p>

          <p className="pt-2 font-bold text-white text-base">— Fatih Mehmet Han Güler</p>
        </div>
      </div>
    </section>
  );
}

export default function ImpressumPage() {
  const { t } = useTranslation();

  return (
    <main className="flex-1">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-50" />
        <div className="section-container max-w-3xl py-14">
          <Link to="/" className="btn-ghost mb-6 inline-flex">
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Link>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            Angaben gemäß § 5 TMG
          </p>
          <h1 className="text-4xl font-extrabold text-white">{t('impressum.title')}</h1>
        </div>
      </section>

      <div className="section-container max-w-3xl py-12">
        <div className="space-y-6">

          {/* Profil-Karte */}
          <section className="card-base">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-5">
                {/* Avatar Initials */}
                <div className="relative flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-2xl font-extrabold text-white shadow-glow">
                    FG
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-success text-white text-xs">
                    ✓
                  </span>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-white tracking-tight">
                    Fatih Mehmet Han Güler
                  </p>
                  <p className="text-sm text-primary-400 font-medium mt-0.5">
                    Gründer &amp; Entwickler · BüroBrücke
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="badge badge-primary">
                      <Code2 className="h-3 w-3" /> Softwareentwickler
                    </span>
                    <span className="badge badge-neutral">
                      <Globe className="h-3 w-3" /> Deutschland
                    </span>
                  </div>
                </div>
              </div>

              {/* Kontakt-Buttons */}
              <div className="flex flex-col gap-2 sm:items-end">
                <LinkedInButton />
                <a
                  href="mailto:kontakt@buerobruecke.de"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card-2 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-primary-500/40 hover:text-white"
                >
                  <Mail className="h-4 w-4 text-slate-400" />
                  kontakt@buerobruecke.de
                </a>
              </div>
            </div>
          </section>

          {/* Persönliche Geschichte */}
          <StorySection />

          {/* Über das Projekt */}
          <section className="card-base">
            <h2 className="text-base font-bold text-white mb-3">Über das Projekt</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              BüroBrücke ist ein gemeinnütziges Softwareprojekt ohne kommerzielle Absicht. Ziel
              ist es, Einwanderern und Geflüchteten in Deutschland kostenlos dabei zu helfen,
              Behördenbriefe zu verstehen und zu beantworten — in ihrer Muttersprache,
              unterstützt durch moderne KI-Technologie.
            </p>
          </section>

          {/* Disclaimer + Tech nebeneinander */}
          <div className="grid gap-6 sm:grid-cols-2">
            <section className="card-base">
              <h2 className="text-base font-bold text-white mb-3">{t('impressum.disclaimer.title')}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t('impressum.disclaimer.content')}
              </p>
            </section>

            <section className="card-base">
              <h2 className="text-base font-bold text-white mb-3">{t('impressum.tech.title')}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {t('impressum.tech.content')}
              </p>
              <div className="flex flex-wrap gap-2">
                {['FastAPI', 'React', 'Claude AI', 'Tesseract OCR', 'SQLite'].map((tech) => (
                  <span key={tech} className="badge badge-neutral text-xs">{tech}</span>
                ))}
              </div>
            </section>
          </div>

          {/* Haftung */}
          <section className="card-base">
            <h2 className="text-base font-bold text-white mb-3">Haftung für Links</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir
              keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der
              jeweilige Anbieter oder Betreiber verantwortlich.
            </p>
          </section>

          {/* Footer-CTA */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 text-center">
            <p className="text-sm text-slate-400 mb-4">
              Fragen, Kooperationen oder Feedback? Ich freue mich über eine direkte Nachricht.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <LinkedInButton />
              <a
                href="mailto:kontakt@buerobruecke.de"
                className="btn-secondary text-sm"
              >
                <Mail className="h-4 w-4" />
                E-Mail schreiben
              </a>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
