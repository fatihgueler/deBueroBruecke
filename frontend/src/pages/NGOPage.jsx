import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Users, Shield, Globe2, Zap, CheckCircle2, Building2, Heart, Mail } from 'lucide-react';

const USE_CASES = [
  { icon: Users,    title: 'Sozialberatung',          desc: 'Berater helfen Klienten direkt beim Termin – Brief hochladen, sofort Erklärung bekommen, gemeinsam nächste Schritte besprechen.' },
  { icon: Building2,title: 'Kommunale Beratungsstellen',desc: 'Jobcenter, Sozialämter und Ausländerbehörden können BüroBrücke als Tool empfehlen, um Rückfragen zu reduzieren.' },
  { icon: Globe2,   title: 'Integrationsbeauftragte', desc: 'Integrationsbeauftragte können Neubürgern BüroBrücke empfehlen als erste Anlaufstelle bei Briefen.' },
  { icon: Heart,    title: 'Ehrenamt & Flüchtlingshilfe', desc: 'Ehrenamtliche ohne Sprachkenntnisse können trotzdem helfen – BüroBrücke übernimmt die Sprachbarriere.' },
];

const BENEFITS = [
  'Sofortige Analyse in 9 Sprachen',
  'Keine technischen Kenntnisse nötig',
  'DSGVO-konform und datensicher',
  'Kostenlos für gemeinnützige Organisationen',
  'Professionelle Antwortentwürfe auf Deutsch',
  'Erkennt über 50 Behörden und Brieftypen',
  'Funktioniert auf Smartphone und Desktop',
  'Kein Login für Demo-Nutzung notwendig',
];

export default function NGOPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-60" />
        <div className="section-container max-w-5xl py-20">
          <Link to="/" className="btn-ghost mb-8 inline-flex text-sm"><ArrowLeft className="h-4 w-4" /> Startseite</Link>
          <div className="badge badge-primary mb-4">Für Organisationen & Behörden</div>
          <h1 className="text-4xl font-extrabold text-white md:text-5xl text-balance mb-4">
            BüroBrücke für NGOs, Beratungsstellen und Behörden
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mb-8">
            Helfen Sie Ihren Klienten effizienter — mit KI-gestützter Briefanalyse in 9 Sprachen.
            Kostenlos. Sofort einsatzbereit.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="mailto:kooperationen@buerobruecke.de" className="btn-primary text-base px-7 py-3">
              Kooperation anfragen <ArrowRight className="h-5 w-5" />
            </a>
            <Link to="/demo" className="btn-secondary text-base px-6 py-3">
              Live-Demo ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-container max-w-5xl py-20">
        <div className="mb-12 text-center">
          <h2 className="section-title">Wer nutzt BüroBrücke?</h2>
          <p className="section-subtitle">Maßgeschneidert für Menschen, die täglich mit Behördenpost arbeiten.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {USE_CASES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-hover">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/15 border border-primary-500/20">
                <Icon className="h-5 w-5 text-primary-400" />
              </div>
              <h3 className="font-bold text-white mb-1">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-border bg-surface-2/40">
        <div className="section-container max-w-5xl py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="section-title mb-6">Was BüroBrücke bietet</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {BENEFITS.map(b => (
                  <div key={b} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-base bg-primary-500/5 border-primary-500/20">
              <Zap className="h-8 w-8 text-primary-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Sofort einsatzbereit</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Keine Installation, keine IT-Abteilung, keine langen Einführungsprozesse.
                BüroBrücke funktioniert im Browser — auf jedem Gerät.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Zeigen Sie einfach die Demo-Seite Ihren Klienten oder empfehlen Sie die kostenlose
                Registrierung direkt weiter.
              </p>
              <Link to="/demo" className="btn-primary text-sm w-full justify-center">
                Demo ausprobieren
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Datenschutz Hinweis */}
      <section className="section-container max-w-5xl py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Shield, title: 'DSGVO-konform', desc: 'Alle Daten werden auf deutschen Servern verarbeitet. Keine Weitergabe an Dritte.' },
            { icon: Globe2, title: '9 Sprachen', desc: 'Deutsch, Türkisch, Arabisch, Russisch, Kurdisch, Ukrainisch, Farsi, Albanisch, Serbisch.' },
            { icon: Users, title: 'Für alle kostenlos', desc: 'BüroBrücke ist ein gemeinnütziges Projekt — kostenlos für Nutzer und Organisationen.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-base text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 border border-primary-500/20">
                <Icon className="h-5 w-5 text-primary-400" />
              </div>
              <h3 className="font-bold text-white mb-1">{title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / Kontakt */}
      <section className="border-t border-border bg-surface-2/30">
        <div className="section-container max-w-3xl py-20 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Interesse an einer Kooperation?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Wir arbeiten gerne mit Beratungsstellen, NGOs, Kommunen und staatlichen Einrichtungen zusammen.
            Schreiben Sie uns — wir melden uns innerhalb von 48 Stunden.
          </p>
          <a href="mailto:kooperationen@buerobruecke.de" className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2">
            <Mail className="h-5 w-5" /> kooperationen@buerobruecke.de
          </a>
          <p className="mt-4 text-xs text-slate-600">
            Oder schreiben Sie direkt an Fatih Mehmet Han Güler ·{' '}
            <a href="https://www.linkedin.com/in/fatih-güler-0206a639a/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">LinkedIn</a>
          </p>
        </div>
      </section>
    </main>
  );
}
