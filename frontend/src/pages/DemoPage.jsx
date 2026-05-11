import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2, FileText, Megaphone, AlertOctagon, ListChecks,
  Sparkles, Clock, ArrowRight, ShieldAlert, Info,
} from 'lucide-react';

const DEMO_LETTER = `Finanzamt Berlin-Mitte
Brunnenstraße 149, 10115 Berlin

Herrn/Frau [Name]
[Anschrift]

Berlin, 15. Januar 2025
Aktenzeichen: 11/542/19823

EINKOMMENSTEUERBESCHEID 2023

Sehr geehrte(r) Steuerpflichtige(r),

auf Grund Ihrer Einkommensteuererklärung für das Jahr 2023 ergeht folgender Bescheid:

Die Einkommensteuer wird auf 1.840,00 EUR festgesetzt.
Bisher festgesetzt:             0,00 EUR
Abzüglich geleisteter Vorauszahlungen: 1.200,00 EUR

NACHZAHLUNG: 640,00 EUR

Bitte überweisen Sie den Betrag von 640,00 Euro bis zum 14. Februar 2025 auf das Konto:
IBAN: DE12 1000 0010 0123 4567 89
BIC: MARKDEF1100
Verwendungszweck: 11/542/19823 / ESt 2023

Bei nicht fristgerechter Zahlung werden Säumniszuschläge erhoben.

Mit freundlichen Grüßen
Finanzamt Berlin-Mitte`;

const DEMO_ANALYSIS = {
  authority_type: 'Finanzamt Berlin-Mitte',
  letter_type: 'Einkommensteuerbescheid 2023',
  deadline: '2025-02-14',
  urgency_level: 'high',
  demand: 'Nachzahlung von 640,00 Euro Einkommensteuer für das Jahr 2023.',
  consequence: 'Bei nicht fristgerechter Zahlung werden Säumniszuschläge (0,5 % pro Monat) erhoben. Bei längerem Zahlungsverzug kann das Finanzamt Vollstreckungsmaßnahmen einleiten.',
  action_required: '1. Überweise 640,00 € bis spätestens 14. Februar 2025.\n2. Nutze die angegebene IBAN und den Verwendungszweck (Aktenzeichen).\n3. Hebe diesen Bescheid gut auf – er ist wichtig für deine Unterlagen.',
  full_explanation: 'Das Finanzamt hat deine Einkommensteuer für das Jahr 2023 berechnet. Du musst insgesamt 1.840 Euro Steuer zahlen. Da du bereits 1.200 Euro in Vorauszahlungen geleistet hast, musst du jetzt noch 640 Euro nachzahlen. Du musst diesen Betrag bis zum 14. Februar 2025 überweisen. Wenn du nicht rechtzeitig zahlst, kommen Strafgebühren dazu.',
  reply_draft: `[Dein Name]
[Deine Anschrift]
[Datum]

Finanzamt Berlin-Mitte
Brunnenstraße 149
10115 Berlin

Aktenzeichen: 11/542/19823

Sehr geehrte Damen und Herren,

ich bestätige den Erhalt Ihres Einkommensteuerbescheids 2023 vom 15. Januar 2025.

Die Nachzahlung in Höhe von 640,00 Euro werde ich fristgerecht bis zum 14. Februar 2025 auf das angegebene Konto überweisen.

Mit freundlichen Grüßen,
[Unterschrift]
[Dein Name]`,
};

const URGENCY_CONFIG = {
  low:      { cls: 'badge-success',  label: 'Niedrige Dringlichkeit' },
  medium:   { cls: 'badge-warning',  label: 'Mittlere Dringlichkeit' },
  high:     { cls: 'badge-warning',  label: 'Hohe Dringlichkeit'     },
  critical: { cls: 'badge-danger',   label: 'Kritisch!'              },
};

function DaysLeft({ deadline }) {
  const days = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  const cls = days <= 7 ? 'text-danger' : days <= 14 ? 'text-warning' : 'text-success';
  return (
    <span className={`text-sm font-semibold ${cls}`}>
      {days > 0 ? `Noch ${days} Tage` : 'Abgelaufen'}
    </span>
  );
}

function Section({ icon: Icon, title, accent, children }) {
  const accentMap = { danger: 'text-danger', success: 'text-success', default: 'text-primary-400' };
  const color = accentMap[accent] || accentMap.default;
  return (
    <div className="card-base">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-5 w-5 ${color}`} />
        <h3 className="font-semibold text-slate-300 text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function DemoPage() {
  const { t } = useTranslation();
  const [showReply, setShowReply] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const urg = URGENCY_CONFIG[DEMO_ANALYSIS.urgency_level];

  return (
    <main className="flex-1">
      {/* Banner */}
      <div className="border-b border-warning/30 bg-warning/5">
        <div className="section-container flex items-center gap-3 py-3 text-sm">
          <Info className="h-4 w-4 text-warning flex-shrink-0" />
          <span className="text-slate-300">
            <span className="font-semibold text-warning">Demo-Modus</span> — Dies ist ein Beispiel-Behördenbrief.{' '}
            <Link to="/register" className="text-primary-400 hover:underline font-medium">
              Kostenlos registrieren →
            </Link>
          </span>
        </div>
      </div>

      <div className="section-container max-w-4xl py-10">
        <div className="mb-8">
          <div className="badge badge-primary mb-3">Live-Demo</div>
          <h1 className="text-3xl font-extrabold text-white">So funktioniert BüroBrücke</h1>
          <p className="mt-2 text-slate-400">
            Ein echtes Beispiel: Einkommensteuerbescheid vom Finanzamt Berlin — analysiert und erklärt.
          </p>
          <button
            type="button"
            onClick={() => setShowLetter(!showLetter)}
            className="btn-ghost mt-3 text-sm"
          >
            <FileText className="h-4 w-4" />
            {showLetter ? 'Brief ausblenden' : 'Originalbief anzeigen'}
          </button>
        </div>

        {showLetter && (
          <div className="mb-6 animate-fade-in rounded-2xl border border-border bg-surface p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Originalbrief</p>
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-relaxed">{DEMO_LETTER}</pre>
          </div>
        )}

        {/* Header-Infos */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className={`badge ${urg.cls} text-sm`}>
            <ShieldAlert className="h-3.5 w-3.5" />
            {urg.label}
          </span>
          {DEMO_ANALYSIS.deadline && (
            <span className="flex items-center gap-1.5 text-sm text-slate-400">
              <Clock className="h-4 w-4" />
              Frist: <strong className="text-white">14. Februar 2025</strong>
              <span className="ml-1"><DaysLeft deadline={DEMO_ANALYSIS.deadline} /></span>
            </span>
          )}
        </div>

        {/* Analyse-Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <Section icon={Building2} title="Behörde">
            <p className="text-lg font-bold text-white">{DEMO_ANALYSIS.authority_type}</p>
          </Section>

          <Section icon={FileText} title="Art des Schreibens">
            <p className="text-lg font-bold text-white">{DEMO_ANALYSIS.letter_type}</p>
          </Section>

          <Section icon={Megaphone} title="Was wird gefordert?" accent="default">
            <p className="text-slate-200 leading-relaxed">{DEMO_ANALYSIS.demand}</p>
          </Section>

          <Section icon={AlertOctagon} title="Was passiert, wenn ich nichts tue?" accent="danger">
            <p className="text-slate-300 leading-relaxed text-sm">{DEMO_ANALYSIS.consequence}</p>
          </Section>

          <div className="card-base md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="h-5 w-5 text-success" />
              <h3 className="font-semibold text-slate-300 text-sm">Was solltest du jetzt tun?</h3>
            </div>
            {DEMO_ANALYSIS.action_required.split('\n').map((step, i) => (
              <div key={i} className="flex items-start gap-3 mb-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-success/20 text-success text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-200">{step.replace(/^\d+\.\s*/, '')}</p>
              </div>
            ))}
          </div>

          <div className="card-base md:col-span-2 bg-primary-500/5 border-primary-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary-400" />
              <h3 className="font-semibold text-slate-300 text-sm">Vollständige Erklärung (auf Deutsch)</h3>
            </div>
            <p className="text-slate-200 leading-relaxed">{DEMO_ANALYSIS.full_explanation}</p>
          </div>

          {/* Antwortentwurf */}
          <div className="card-base md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Antwortentwurf (automatisch erstellt)</h3>
              <button
                type="button"
                onClick={() => setShowReply(!showReply)}
                className="btn-secondary text-xs px-3 py-1.5"
              >
                {showReply ? 'Ausblenden' : 'Entwurf anzeigen'}
              </button>
            </div>
            {showReply && (
              <pre className="animate-fade-in mt-3 whitespace-pre-wrap rounded-xl border border-border bg-surface p-4 font-sans text-sm text-slate-200 leading-relaxed">
                {DEMO_ANALYSIS.reply_draft}
              </pre>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-primary-500/25 bg-primary-500/8 p-8 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-2">
            Jetzt deine eigenen Briefe analysieren
          </h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            Lade deinen Behördenbrief hoch — JPG, PNG oder PDF — und erhalte in Sekunden eine
            klare Erklärung in deiner Muttersprache. Kostenlos.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-3 text-base">
              Kostenlos registrieren
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/login" className="btn-secondary px-6 py-3 text-base">
              Schon registriert? Anmelden
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-600">Keine Kreditkarte · Sofort loslegen · 6 Sprachen verfügbar</p>
        </div>
      </div>
    </main>
  );
}
