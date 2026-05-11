import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Upload, Brain, CheckCircle2, Files, ArrowRight } from 'lucide-react';

import DropZone from '../components/Upload/DropZone';
import Spinner from '../components/UI/Spinner';
import Card from '../components/UI/Card';
import { analysisApi, documentsApi, extractErrorMessage } from '../api/client';

function FileRow({ name, status, progress }) {
  const cfg = {
    queued:    { cls: 'text-slate-400',   label: 'Wartet…'         },
    uploading: { cls: 'text-primary-400', label: `${progress}%`    },
    analyzing: { cls: 'text-warning',     label: 'Analysiert…'     },
    done:      { cls: 'text-success',     label: '✓ Fertig'        },
    error:     { cls: 'text-danger',      label: '✗ Fehler'        },
  };
  const { cls, label } = cfg[status] || cfg.queued;
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
      <Files className="h-4 w-4 text-slate-500 flex-shrink-0" />
      <span className="flex-1 text-sm text-slate-200 truncate">{name}</span>
      <span className={`text-xs font-semibold ${cls} whitespace-nowrap`}>{label}</span>
      {status === 'uploading' && (
        <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

export default function UploadPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);   // { file, status, progress, docId }
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const handleFiles = (accepted) => {
    const entries = accepted.map(f => ({ file: f, status: 'queued', progress: 0, docId: null }));
    setFiles(prev => [...prev, ...entries]);
  };

  const updateFile = (idx, patch) => setFiles(prev => prev.map((f, i) => i === idx ? { ...f, ...patch } : f));

  const processAll = async () => {
    if (running || files.length === 0) return;
    setRunning(true);
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const { file, status } = files[i];
      if (status === 'done' || status === 'error') continue;

      // Upload
      updateFile(i, { status: 'uploading', progress: 0 });
      let doc;
      try {
        const res = await documentsApi.upload(file, (e) => {
          if (e.total) updateFile(i, { progress: Math.round((e.loaded / e.total) * 100) });
        });
        doc = res.data;
        updateFile(i, { status: 'analyzing', docId: doc.id });
      } catch (err) {
        updateFile(i, { status: 'error' });
        toast.error(`${file.name}: ${extractErrorMessage(err, t('upload.errorUpload'))}`);
        continue;
      }

      // Analyse
      try {
        await analysisApi.analyze(doc.id);
        updateFile(i, { status: 'done' });
        results.push(doc.id);
      } catch {
        updateFile(i, { status: 'done' }); // Weiter auch bei Analyse-Fehler
        results.push(doc.id);
      }
    }

    setRunning(false);
    setDone(true);
    if (results.length === 1) {
      navigate(`/result/${results[0]}`, { replace: true });
    } else {
      toast.success(`${results.length} Briefe hochgeladen!`);
    }
  };

  const allDone = files.length > 0 && files.every(f => f.status === 'done' || f.status === 'error');
  const hasPending = files.some(f => f.status === 'queued');

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('upload.title')}</h1>
        <p className="mt-2 text-slate-400">{t('upload.subtitle')}</p>
      </div>

      {/* Tipps */}
      <Card className="mb-5 bg-primary-500/5 border-primary-500/20">
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          {['JPG / PNG / PDF', 'Max. 10 MB pro Datei', 'Bis zu 10 Briefe gleichzeitig'].map(tip => (
            <span key={tip} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary-400 flex-shrink-0" />{tip}
            </span>
          ))}
        </div>
      </Card>

      {/* DropZone — Mehrfachauswahl */}
      <DropZone onFiles={handleFiles} disabled={running} multiple />

      {/* Dateiliste */}
      {files.length > 0 && (
        <Card className="mt-5 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-white">{files.length} Datei{files.length !== 1 ? 'en' : ''} ausgewählt</p>
            {!allDone && (
              <button type="button" onClick={() => setFiles([])} className="text-xs text-slate-500 hover:text-danger transition-colors">
                Alle entfernen
              </button>
            )}
          </div>
          <div>
            {files.map((f, i) => (
              <FileRow key={i} name={f.file.name} status={f.status} progress={f.progress} />
            ))}
          </div>

          {/* Aktions-Buttons */}
          {!running && !allDone && (
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={processAll} className="btn-primary flex-1 py-3">
                <Upload className="h-4 w-4" />
                {files.length === 1 ? 'Brief hochladen & analysieren' : `${files.filter(f => f.status === 'queued').length} Briefe hochladen`}
              </button>
            </div>
          )}

          {running && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
              <Spinner size={20} />
              Verarbeite Briefe…
            </div>
          )}

          {done && !running && (
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => { setFiles([]); setDone(false); }} className="btn-secondary flex-1">
                Weitere Briefe hochladen
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} className="btn-primary flex-1">
                Zur Übersicht <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </Card>
      )}
    </main>
  );
}
