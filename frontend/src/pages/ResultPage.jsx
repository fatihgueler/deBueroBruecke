import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Building2,
  FileText,
  Megaphone,
  AlertOctagon,
  Sparkles,
  ListChecks,
  Mail,
  Copy,
  CheckCheck,
  Printer,
} from 'lucide-react';

import { analysisApi, documentsApi, extractErrorMessage } from '../api/client';
import AnalysisCard from '../components/Result/AnalysisCard';
import DeadlineBadge from '../components/Result/DeadlineBadge';
import ActionSteps from '../components/Result/ActionSteps';
import Spinner from '../components/UI/Spinner';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

export default function ResultPage() {
  const { documentId } = useParams();
  const { t } = useTranslation();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingReply, setGeneratingReply] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadDocument = async () => {
    try {
      const { data } = await documentsApi.get(documentId);
      setDocument(data);
      return data;
    } catch (error) {
      toast.error(extractErrorMessage(error));
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await loadDocument();
      if (!data || cancelled) {
        setLoading(false);
        return;
      }
      if (!data.analysis && data.status !== 'error') {
        setAnalyzing(true);
        try {
          const result = await analysisApi.analyze(data.id);
          if (!cancelled) {
            setDocument({ ...data, status: 'analyzed', analysis: result.data });
          }
        } catch (error) {
          if (!cancelled) toast.error(extractErrorMessage(error, t('upload.errorAnalysis')));
        } finally {
          if (!cancelled) setAnalyzing(false);
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  const handleGenerateReply = async () => {
    setGeneratingReply(true);
    try {
      const { data } = await analysisApi.reply(documentId);
      setDocument((current) => (current ? { ...current, analysis: data } : current));
      toast.success(t('result.replyDraft'));
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setGeneratingReply(false);
    }
  };

  const handleCopy = async () => {
    if (!document?.analysis?.reply_draft) return;
    try {
      await navigator.clipboard.writeText(document.analysis.reply_draft);
      setCopied(true);
      toast.success(t('result.copied'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('common.error'));
    }
  };

  if (loading || analyzing) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Spinner label={analyzing ? t('upload.analyzing') : t('common.loading')} size={36} />
      </main>
    );
  }

  if (!document) {
    return (
      <main className="mx-auto max-w-3xl flex-1 px-4 py-16 text-center">
        <p className="text-slate-400">{t('common.error')}</p>
        <Link to="/dashboard" className="btn-primary mt-6 inline-flex">
          <ArrowLeft className="h-4 w-4" />
          {t('result.backToDashboard')}
        </Link>
      </main>
    );
  }

  const analysis = document.analysis;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <div className="mb-4 flex items-center justify-between no-print">
        <Link to="/dashboard" className="btn-ghost inline-flex">
          <ArrowLeft className="h-4 w-4" />
          {t('result.backToDashboard')}
        </Link>
        <button type="button" onClick={() => window.print()} className="btn-secondary text-sm">
          <Printer className="h-4 w-4" />
          Als PDF speichern
        </button>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('result.title')}</h1>
          <p className="mt-1 text-slate-400">{document.original_filename}</p>
        </div>
        {analysis ? <DeadlineBadge deadline={analysis.deadline} urgency={analysis.urgency_level} /> : null}
      </div>

      {!analysis ? (
        <Card className="mt-8 text-center">
          <p className="text-slate-300">{t('upload.errorAnalysis')}</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <AnalysisCard icon={Building2} title={t('result.authority')}>
            <p className="text-lg font-medium text-white">{analysis.authority_type || '—'}</p>
          </AnalysisCard>

          <AnalysisCard icon={FileText} title={t('result.letterType')}>
            <p className="text-lg font-medium text-white">{analysis.letter_type || '—'}</p>
          </AnalysisCard>

          <AnalysisCard icon={Megaphone} title={t('result.demand')} className="md:col-span-2">
            <p className="whitespace-pre-line">{analysis.demand}</p>
          </AnalysisCard>

          <AnalysisCard icon={AlertOctagon} title={t('result.consequence')} accent="danger">
            <p className="whitespace-pre-line">{analysis.consequence}</p>
          </AnalysisCard>

          <AnalysisCard icon={ListChecks} title={t('result.action')} accent="success">
            <ActionSteps text={analysis.action_required} />
          </AnalysisCard>

          <AnalysisCard icon={Sparkles} title={t('result.fullExplanation')} className="md:col-span-2">
            <p className="whitespace-pre-line text-slate-200">{analysis.full_explanation}</p>
          </AnalysisCard>

          <Card className="md:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-800 text-primary-500">
                  <Mail className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-white">{t('result.replyDraft')}</h3>
              </div>
              <div className="flex gap-2">
                {analysis.reply_draft ? (
                  <Button variant="secondary" onClick={handleCopy}>
                    {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? t('result.copied') : t('result.copyReply')}
                  </Button>
                ) : null}
                <Button onClick={handleGenerateReply} loading={generatingReply}>
                  <Sparkles className="h-4 w-4" />
                  {analysis.reply_draft ? t('result.regenerateReply') : t('result.generateReply')}
                </Button>
              </div>
            </div>

            {analysis.reply_draft ? (
              <>
                <p className="mt-3 text-sm text-slate-400">{t('result.replyHint')}</p>
                <pre className="mt-4 max-h-[480px] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-surface p-4 text-sm leading-relaxed text-slate-200 font-sans">
                  {analysis.reply_draft}
                </pre>
              </>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                {generatingReply ? t('result.generating') : ''}
              </p>
            )}
          </Card>
        </div>
      )}
    </main>
  );
}
