import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Phone, Clock, ExternalLink, Building2 } from 'lucide-react';
import Card from '../components/UI/Card';

const BEHOERDEN = [
  { plzPrefix: ['10','12','13'], stadt: 'Berlin', name: 'Ausländerbehörde Berlin', adresse: 'Friedrich-Krause-Ufer 24, 13353 Berlin', tel: '+49 30 90269-0', web: 'https://www.berlin.de/labo/willkommen-in-berlin/auslaenderrecht/', zeiten: 'Mo, Di, Fr 7:30–14:00 · Do 14:00–18:00' },
  { plzPrefix: ['20','21','22'], stadt: 'Hamburg', name: 'Einwanderungsbehörde Hamburg', adresse: 'Hammer Straße 30–34, 22041 Hamburg', tel: '+49 40 42839-0', web: 'https://www.hamburg.de/einwanderungsbehoerde/', zeiten: 'Mo–Fr 8:00–12:00 (Termin erforderlich)' },
  { plzPrefix: ['80','81','82'], stadt: 'München', name: 'Ausländerbehörde München', adresse: 'Ruppertstraße 19, 80337 München', tel: '+49 89 233-96010', web: 'https://www.muenchen.de/rathaus/Stadtverwaltung/Kreisverwaltungsreferat/Auslaenderwesen.html', zeiten: 'Di 8:30–11:30 · Do 8:30–11:30 & 14:00–17:30' },
  { plzPrefix: ['60','61','65'], stadt: 'Frankfurt', name: 'Ausländerbehörde Frankfurt', adresse: 'Kleyerstraße 86, 60326 Frankfurt', tel: '+49 69 212-30900', web: 'https://frankfurt.de/service-und-rathaus/verwaltung/aemter-und-institutionen/auslaenderbehorde', zeiten: 'Mo–Fr 8:00–12:00 (Termin erforderlich)' },
  { plzPrefix: ['50','51'], stadt: 'Köln', name: 'Ausländerangelegenheiten Köln', adresse: 'Kalk Karree, Kalker Hauptstraße 247-273, 51103 Köln', tel: '+49 221 221-0', web: 'https://www.stadt-koeln.de/service/produkte/00283/index.html', zeiten: 'Mo–Fr 8:00–12:00 (Termin erforderlich)' },
  { plzPrefix: ['40','41'], stadt: 'Düsseldorf', name: 'Ausländerbehörde Düsseldorf', adresse: 'Willi-Becker-Allee 7, 40227 Düsseldorf', tel: '+49 211 89-0', web: 'https://www.duesseldorf.de/ordnungsamt/auslaenderwesen/', zeiten: 'Mo–Fr 8:00–12:00 (Termin online buchen)' },
  { plzPrefix: ['70','71'], stadt: 'Stuttgart', name: 'Ausländerbehörde Stuttgart', adresse: 'Eberhardstraße 37, 70173 Stuttgart', tel: '+49 711 216-0', web: 'https://www.stuttgart.de/item/show/286888/', zeiten: 'Mo–Fr 8:00–12:00 (Termin erforderlich)' },
  { plzPrefix: ['90','91'], stadt: 'Nürnberg', name: 'Ausländerbehörde Nürnberg', adresse: 'Innerer Laufer Platz 7, 90403 Nürnberg', tel: '+49 911 231-0', web: 'https://www.nuernberg.de/internet/auslaenderwesen/', zeiten: 'Mo, Mi, Fr 8:00–12:00' },
  { plzPrefix: ['04','06'], stadt: 'Leipzig / Halle', name: 'Ausländerbehörde Leipzig', adresse: 'Goldschmidtstraße 26, 04103 Leipzig', tel: '+49 341 123-0', web: 'https://www.leipzig.de/buergerservice-und-verwaltung/aemter-und-behoerden/ordnungsamt/', zeiten: 'Di 8:00–16:00 · Do 8:00–18:00' },
  { plzPrefix: ['28','27'], stadt: 'Bremen', name: 'Ausländerbehörde Bremen', adresse: 'Stresemannstraße 48, 28207 Bremen', tel: '+49 421 361-0', web: 'https://www.bremen.de/auslaenderbehoerde', zeiten: 'Mo–Fr 8:00–12:00' },
];

const JOBCENTER_HINWEIS = 'Das für dich zuständige Jobcenter findest du unter bundesagentur.de/suche nach deiner PLZ.';

export default function BehoerdenFinderPage() {
  const [plz, setPlz] = useState('');
  const [results, setResults] = useState(null);

  const handleSearch = () => {
    if (plz.length < 2) return;
    const prefix = plz.slice(0, 2);
    const found = BEHOERDEN.filter(b => b.plzPrefix.includes(prefix));
    setResults(found);
  };

  return (
    <main className="flex-1">
      <section className="border-b border-border bg-surface-2/60">
        <div className="section-container max-w-3xl py-14">
          <Link to="/" className="btn-ghost mb-6 inline-flex text-sm"><ArrowLeft className="h-4 w-4" /> Startseite</Link>
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="h-7 w-7 text-primary-400" />
            <h1 className="text-4xl font-extrabold text-white">Behörden-Finder</h1>
          </div>
          <p className="text-slate-400">Finde die zuständige Ausländerbehörde in deiner Stadt.</p>
        </div>
      </section>

      <div className="section-container max-w-3xl py-10">
        {/* Suche */}
        <Card className="mb-8">
          <label className="label-field">Deine Postleitzahl (PLZ)</label>
          <div className="flex gap-3">
            <input
              type="text" value={plz} onChange={e => setPlz(e.target.value.replace(/\D/g, '').slice(0, 5))}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="z. B. 10115" maxLength={5}
              className="input-field flex-1 text-lg tracking-widest"
            />
            <button type="button" onClick={handleSearch} className="btn-primary px-6">
              <Search className="h-5 w-5" /> Suchen
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">Derzeit unterstützt: Berlin, Hamburg, München, Frankfurt, Köln, Düsseldorf, Stuttgart, Nürnberg, Leipzig, Bremen</p>
        </Card>

        {/* Ergebnisse */}
        {results !== null && (
          <div className="space-y-4 animate-fade-in">
            {results.length === 0 ? (
              <Card className="text-center py-10">
                <Building2 className="mx-auto h-10 w-10 text-slate-600 mb-3" />
                <p className="text-slate-300 font-semibold mb-1">Keine Behörde für PLZ {plz} gefunden.</p>
                <p className="text-slate-500 text-sm mb-4">
                  Suche direkt auf{' '}
                  <a href="https://www.bamf.de/DE/Service/Left/Behoerdenwegweiser/behoerdenwegweiser-node.html"
                    target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">
                    bamf.de/Behördenwegweiser
                  </a>
                </p>
              </Card>
            ) : (
              results.map(b => (
                <Card key={b.name} className="hover:border-primary-500/25 transition-all">
                  <h2 className="text-lg font-bold text-white mb-3">{b.name}</h2>
                  <div className="grid gap-2 sm:grid-cols-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{b.adresse}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <a href={`tel:${b.tel}`} className="text-primary-400 hover:underline">{b.tel}</a>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-400">{b.zeiten}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <a href={b.web} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline text-xs break-all">
                        Offizielle Website
                      </a>
                    </div>
                  </div>
                </Card>
              ))
            )}

            {/* Jobcenter Hinweis */}
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <p className="text-sm font-semibold text-white mb-1">Jobcenter suchen?</p>
              <p className="text-xs text-slate-400">{JOBCENTER_HINWEIS}</p>
              <a href="https://www.arbeitsagentur.de/vor-ort/jobcenter/alle" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs text-primary-400 hover:underline">
                Jobcenter-Suche öffnen <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {/* CTA */}
        {results === null && (
          <div className="rounded-2xl border border-primary-500/20 bg-primary-500/5 p-8 text-center mt-8">
            <p className="font-semibold text-white mb-2">Hast du einen Brief von einer Behörde bekommen?</p>
            <p className="text-slate-400 text-sm mb-4">Lade ihn hoch – BüroBrücke erklärt ihn sofort in deiner Sprache.</p>
            <Link to="/demo" className="btn-primary">Live-Demo ausprobieren</Link>
          </div>
        )}
      </div>
    </main>
  );
}
