import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import DropZone from '../components/Upload/DropZone';
import Spinner from '../components/UI/Spinner';
import Card from '../components/UI/Card';
import { analysisApi, documentsApi, extractErrorMessage } from '../api/client';

const STAGE_LABELS = {
  uploading: 'upload.uploading',
  analyzing: 'upload.analyzing',
};

export default function UploadPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stage, setStage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFile = async (file) => {
    setStage('uploading');
    setProgress(0);
    let document;
    try {
      const response = await documentsApi.upload(file, (event) => {
        if (event.total) {
          setProgress(Math.round((event.loaded * 100) / event.total));
        }
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
      toast.success(t('result.title'));
      navigate(`/result/${document.id}`, { replace: true });
    } catch (error) {
      toast.error(extractErrorMessage(error, t('upload.errorAnalysis')));
      navigate(`/result/${document.id}`, { replace: true });
    } finally {
      setStage(null);
    }
  };

  const isBusy = stage !== null;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-bold text-white">{t('upload.title')}</h1>
      <p className="mt-2 text-slate-400">{t('upload.subtitle')}</p>

      <div className="mt-8">
        <DropZone onFile={handleFile} disabled={isBusy} />
      </div>

      {isBusy ? (
        <Card className="mt-6 text-center">
          <Spinner label={t(STAGE_LABELS[stage])} size={32} />
          {stage === 'uploading' ? (
            <div className="mx-auto mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-primary-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : null}
        </Card>
      ) : null}
    </main>
  );
}
