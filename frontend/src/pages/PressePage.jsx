import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Linkedin, Mail, FileText, Image, ExternalLink } from 'lucide-react';

const FACTS = [
  { label: 'Gegründet',         value: '2025' },
  { label: 'Gründer',           value: 'Fatih Mehmet Han Güler' },
  { label: 'Unterstützte Sprachen', value: '9 (Deutsch, Türkisch, Arabisch, Russisch, Kurdisch, Ukrainisch, Farsi, Albanisch, Serbisch)' },
  { label: 'Technologie',       value: 'Claude AI (Anthropic), FastAPI, React, Tesseract OCR' },
  { label: 'Kostenmodell',      value: 'Vollständig kostenlos / Non-Profit' },
  { label: 'Zielgruppe',        value: 'Einwanderer, Geflüchtete, Menschen mit Migrationshintergrund in Deutschland' },
  { label: 'Kernfunktion',      value: 'KI-gestützte Analyse und Erklärung von Behördenbriefen in der Muttersprache' },
];

const QUOTES = [
  { text: 'BüroBrücke schließt eine kritische Lücke: Tausende Menschen erhalten täglich Behördenbriefe, die sie nicht verstehen. Diese App kann für sie den Unterschied machen.', name: 'Fatih Mehmet Han Güler', role: 'Gründer, BüroBrücke' },
];

export default function PressePage() {
  return (
    <main className="flex-1">
      <section className="border-b border-border bg-surface-2/60">
        <div className="section-container max-w-4xl py-14">
          <Link to="/" className="btn-ghost mb-6 inline-flex text-sm"><ArrowLeft className="h-4 w-4" /> Startseite</Link>
          <div className="badge badge-neutral mb-4">Presse & Medien</div>
          <h1 className="text-4xl font-extrabold text-white mb-3">Pressebereich</h1>
          <p className="text-slate-400 max-w-2xl">
            Pressematerialien, Fakten und Kontakt für Medienanfragen zu BüroBrücke.
          </p>
        </div>
      </section>

      <div className="section-container max-w-4xl py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Hauptinhalt */}
          <div className="lg:col-span-2 space-y-8">

            {/* Kurzvorstellung */}
            <section className="card-base">
              <h2 className="text-lg font-bold text-white mb-4">Über BüroBrücke</h2>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-white">BüroBrücke</strong> ist eine kostenlose, KI-gestützte Web-App,
                  die Einwanderern und Geflüchteten in Deutschland hilft, Behördenbriefe zu verstehen.
                  Nutzer laden ein Foto oder PDF eines Briefes hoch — die App analysiert den Inhalt und
                  erklärt ihn in wenigen Sekunden in der Muttersprache des Nutzers.
                </p>
                <p>
                  Die App wurde von <strong className="text-white">Fatih Mehmet Han Güler</strong> entwickelt,
                  der selbst mit Migrationshintergrund aufgewachsen ist und als Kind bereits für seine Familie
                  als Dolmetscher für Behördenbriefe fungierte. BüroBrücke ist seine Antwort auf diese
                  persönliche Erfahrung — ein Werkzeug, das kein Kind mehr in diese Lage bringen soll.
                </p>
                <p>
                  Derzeit unterstützt die App 9 Sprachen und erkennt Briefe von über 50 deutschen Behörden
                  und Institutionen, darunter Finanzamt, Jobcenter, Ausländerbehörde, BAMF und Krankenkassen.
                </p>
              </div>
            </section>

            {/* Zitat */}
            <section>
              {QUOTES.map((q, i) => (
                <blockquote key={i} className="rounded-2xl border border-primary-500/20 bg-primary-500/5 p-6">
                  <p className="text-lg italic text-slate-200 leading-relaxed mb-4">„{q.text}"</p>
                  <footer>
                    <p className="font-bold text-white">{q.name}</p>
                    <p className="text-sm text-slate-400">{q.role}</p>
                  </footer>
                </blockquote>
              ))}
            </section>

            {/* Faktenblatt */}
            <section className="card-base">
              <h2 className="text-lg font-bold text-white mb-4">Faktenblatt</h2>
              <dl className="space-y-3">
                {FACTS.map(({ label, value }) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="text-sm font-semibold text-slate-400 sm:w-48 flex-shrink-0">{label}</dt>
                    <dd className="text-sm text-slate-200">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pressekontakt */}
            <section className="card-base">
              <h2 className="text-base font-bold text-white mb-4">Pressekontakt</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-white">Fatih Mehmet Han Güler</p>
                  <p className="text-xs text-slate-400">Gründer & Entwickler</p>
                </div>
                <a href="mailto:presse@buerobruecke.de" className="flex items-center gap-2 text-sm text-primary-400 hover:underline">
                  <Mail className="h-4 w-4" /> presse@buerobruecke.de
                </a>
                <a href="https://www.linkedin.com/in/fatih-güler-0206a639a/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#5ba4e5] hover:underline">
                  <Linkedin className="h-4 w-4" /> LinkedIn-Profil <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </section>

            {/* Downloads */}
            <section className="card-base">
              <h2 className="text-base font-bold text-white mb-4">Materialien</h2>
              <div className="space-y-2">
                {[
                  { icon: Image,    label: 'Logo (SVG)',         href: '/favicon.svg' },
                  { icon: FileText, label: 'Demo ausprobieren',  href: '/demo'        },
                  { icon: FileText, label: 'Glossar ansehen',    href: '/glossar'     },
                ].map(({ icon: Icon, label, href }) => (
                  <Link key={label} to={href}
                    className="flex items-center gap-2.5 rounded-lg border border-border bg-card-2 px-3 py-2.5 text-sm text-slate-300 transition hover:border-primary-500/30 hover:text-white">
                    <Icon className="h-4 w-4 text-slate-400" />
                    {label}
                    <Download className="h-3.5 w-3.5 ml-auto text-slate-500" />
                  </Link>
                ))}
              </div>
            </section>

            {/* Screenshot-Hinweis */}
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Screenshots und Demo-Aufnahmen für redaktionelle Verwendung auf Anfrage verfügbar.
                Bitte kontaktieren Sie uns per E-Mail.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
