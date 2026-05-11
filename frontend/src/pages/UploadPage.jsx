import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Upload, Brain, CheckCircle2 } from 'lucide-react';

import DropZone from '../components/Upload/DropZone';
import Spinner from '../components/UI/Spinner';
import Card from '../components/UI/Card';
import { analysisApi, documentsApi, extractErrorMessage } from '../api/client';

const STAGES = [
  { key: 'uploading', icon: Upload,       labelKey: 'upload.uploading'  },
  { key: 'analyzing', icon: Brain,        labelKey: 'upload.analyzing'  },
  { key: 'done',      icon: CheckCircle2, labelKey: 'result.title'      },
];

export default function UploadPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stage,    setStage]    = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFile = async (file) => {
    setStage('uploading');
    setProgress(0);
    let document;

    try {
      const response = await documentsApi.upload(file, (event) => {
        if (event.total) setProgress(Math.round((event.loaded * 100) / event.total));
      });
      document = response.data;
    } catch (error) {
      setStage(null);
      toast.error(extractErrorMessage(error, t('upload.errorUpload')));
      return;
    }

    setStage('analyzing');
    try {
      await analysisApi.analyze(document.id);
      setStage('done');
      setTimeout(() => navigate(`/result/${document.id}`, { replace: true }), 600);
    } catch (error) {
      toast.error(extractErrorMessage(error, t('upload.errorAnalysis')));
      navigate(`/result/${document.id}`, { replace: true });
    } finally {
      setStage(null);
    }
  };

  const currentStageIdx = STAGES.findIndex((s) => s.key === stage);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('upload.title')}</h1>
        <p className="mt-2 text-slate-400">{t('upload.subtitle')}</p>
      </div>

      {/* Tips */}
      <Card className="mb-6 bg-primary-500/5 border-primary-500/20">
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          {['JPG / PNG / PDF', 'Max. 10 MB', 'Klares, lesbares Bild'].map((tip) => (
            <span key={tip} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary-400 flex-shrink-0" />
              {tip}
            </span>
          ))}
        </div>
      </Card>

      {/* Drop zone */}
      <DropZone onFile={handleFile} disabled={stage !== null} />

      {/* Progress */}
      {stage && (
        <Card className="mt-6 animate-fade-in">
          {/* Stage steps */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {STAGES.filter(s => s.key !== 'done' || stage === 'done').map((s, idx) => {
              const Icon = s.icon;
              const isActive   = s.key === stage;
              const isComplete = STAGES.findIndex(x => x.key === stage) > idx;

              return (
                <div key={s.key} className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all
                    ${isActive   ? 'border-primary-500 bg-primary-500/15 text-primary-400' :
                      isComplete ? 'border-success bg-success/15 text-success' :
                                   'border-border bg-card-2 text-slate-600'}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-xs font-medium hidden sm:inline
                    ${isActive ? 'text-slate-200' : isComplete ? 'text-success' : 'text-slate-600'}`}>
                    {t(s.labelKey)}
                  </span>
                  {idx < STAGES.length - 2 && (
                    <div className={`h-px w-8 ${isComplete ? 'bg-success/40' : 'bg-border'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Spinner + label */}
          <div className="flex flex-col items-center gap-3">
            <Spinner label={t(STAGES.find(s => s.key === stage)?.labelKey || '')} size={32} />

            {/* Upload progress bar */}
            {stage === 'uploading' && (
              <div className="w-full max-w-xs mt-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Hochladen …</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-card-2">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </main>
  );
}
