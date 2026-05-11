import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  { q: 'Ist BüroBrücke wirklich kostenlos?', a: 'Ja, vollständig kostenlos. BüroBrücke ist ein gemeinnütziges Projekt ohne Abonnements, versteckte Kosten oder Werbung. Du brauchst keine Kreditkarte.' },
  { q: 'Welche Dateiformate werden unterstützt?', a: 'JPG, PNG und PDF bis zu 10 MB. Du kannst ein Foto mit dem Handy machen oder einen Scan hochladen. Auch handschriftliche Briefe können erkannt werden, wenn sie lesbar sind.' },
  { q: 'In welchen Sprachen erklärt BüroBrücke die Briefe?', a: 'Aktuell unterstützen wir 9 Sprachen: Deutsch, Türkisch, Arabisch, Russisch, Kurdisch (Kurmancî), Ukrainisch, Farsi, Albanisch und Serbisch. Weitere Sprachen werden kontinuierlich ergänzt.' },
  { q: 'Sind meine Dokumente sicher?', a: 'Ja. Deine Dokumente werden verschlüsselt auf unseren Servern gespeichert und niemals an Dritte weitergegeben. Wir verwenden keine Daten für Werbung oder Training. Du kannst deine Dokumente jederzeit löschen.' },
  { q: 'Kann ich der Analyse vertrauen?', a: 'BüroBrücke nutzt Claude AI von Anthropic — eine der fortschrittlichsten KI-Systeme. Die Analysen sind sehr präzise, ersetzen aber keine Rechtsberatung. Bei wichtigen rechtlichen Fragen empfehlen wir einen Fachanwalt oder eine Beratungsstelle.' },
  { q: 'Was passiert, wenn der Brief schlecht fotografiert ist?', a: 'Wenn die Bildqualität zu niedrig ist, erkennt das System möglicherweise keinen Text. Bitte achte auf gute Beleuchtung, keine Schatten und ein möglichst gerades Bild. PDFs liefern in der Regel die besten Ergebnisse.' },
  { q: 'Was bedeutet "Antwortentwurf erstellen"?', a: 'BüroBrücke kann automatisch einen formellen deutschen Antwortbrief erstellen. Du musst nur die Platzhalter [in eckigen Klammern] mit deinen Daten ausfüllen und den Brief ausdrucken oder abschicken.' },
  { q: 'Kann ich BüroBrücke auch für Arbeit in einer Beratungsstelle nutzen?', a: 'Ja! Sozialarbeiter, Migrationsberater und NGO-Mitarbeiter können BüroBrücke als Werkzeug nutzen, um Klienten zu helfen. Wir bieten spezielle Konditionen für Organisationen an — schreib uns.' },
  { q: 'Funktioniert BüroBrücke auch auf dem Handy?', a: 'Ja, BüroBrücke ist vollständig responsive und für Smartphones optimiert. Du kannst direkt mit der Handy-Kamera ein Foto machen und hochladen.' },
  { q: 'Was mache ich, wenn der Brief sehr dringend ist?', a: 'Achte auf die Dringlichkeitsanzeige nach der Analyse (Niedrig / Mittel / Hoch / Kritisch). Bei kritischer Dringlichkeit und sehr kurzen Fristen empfehlen wir, sofort eine Beratungsstelle zu kontaktieren (z.B. Caritas, AWO, oder eine Migrationsberatung).' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`card-base transition-all duration-200 ${open ? 'border-primary-500/30' : ''}`}>
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-start justify-between gap-4 text-left">
        <span className="font-semibold text-white">{q}</span>
        <ChevronDown className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="mt-4 text-sm leading-relaxed text-slate-300 animate-fade-in border-t border-border pt-4">{a}</p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-border bg-surface-2/60">
        <div className="section-container max-w-3xl py-14">
          <Link to="/" className="btn-ghost mb-6 inline-flex text-sm"><ArrowLeft className="h-4 w-4" /> Startseite</Link>
          <div className="flex items-center gap-3 mb-3">
            <HelpCircle className="h-7 w-7 text-primary-400" />
            <h1 className="text-4xl font-extrabold text-white">Häufige Fragen</h1>
          </div>
          <p className="text-slate-400">Antworten auf die wichtigsten Fragen zu BüroBrücke.</p>
        </div>
      </section>

      <div className="section-container max-w-3xl py-10">
        <div className="space-y-3 mb-12">
          {FAQS.map((item, i) => <FAQItem key={i} {...item} />)}
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="font-semibold text-white mb-2">Noch eine Frage?</p>
          <p className="text-slate-400 text-sm mb-4">Schreib uns direkt — wir antworten so schnell wie möglich.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:kontakt@buerobruecke.de" className="btn-primary">E-Mail schreiben</a>
            <Link to="/impressum" className="btn-secondary">Impressum / Kontakt</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
