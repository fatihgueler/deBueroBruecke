import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FileText, Trash2, Plus, FileImage, FileType2 } from 'lucide-react';

import { documentsApi, extractErrorMessage } from '../api/client';
import Card from '../components/UI/Card';
import Spinner from '../components/UI/Spinner';

const STATUS_STYLES = {
  pending: 'bg-warning/15 text-warning',
  analyzed: 'bg-success/15 text-success',
  error: 'bg-danger/15 text-danger',
};

function formatDate(value, locale) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value),
    );
  } catch {
    return value;
  }
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    documentsApi
      .list()
      .then((res) => setDocuments(res.data))
      .catch((error) => toast.error(extractErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('dashboard.deleteConfirm'))) return;
    try {
      await documentsApi.remove(id);
      setDocuments((current) => current.filter((doc) => doc.id !== id));
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('dashboard.title')}</h1>
          <p className="mt-1 text-slate-400">{t('dashboard.subtitle')}</p>
        </div>
        <Link to="/upload" className="btn-primary">
          <Plus className="h-4 w-4" />
          {t('dashboard.newUpload')}
        </Link>
      </div>

      <div className="mt-8">
        {loading ? (
          <Spinner label={t('common.loading')} className="py-16" />
        ) : documents.length === 0 ? (
          <Card className="py-16 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-600" />
            <p className="mt-4 text-slate-400">{t('dashboard.empty')}</p>
            <Link to="/upload" className="btn-primary mt-6 inline-flex">
              <Plus className="h-4 w-4" />
              {t('dashboard.newUpload')}
            </Link>
          </Card>
        ) : (
          <ul className="grid gap-3">
            {documents.map((doc) => {
              const Icon = doc.file_type === 'pdf' ? FileType2 : FileImage;
              const status = STATUS_STYLES[doc.status] || 'bg-slate-700 text-slate-300';
              return (
                <li key={doc.id}>
                  <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-slate-800 text-primary-500">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">{doc.original_filename}</p>
                        <p className="text-sm text-slate-500">{formatDate(doc.created_at, i18n.language)}</p>
                        {doc.analysis ? (
                          <p className="mt-1 text-sm text-slate-400">
                            {doc.analysis.authority_type} · {doc.analysis.letter_type}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${status}`}>
                        {t(`dashboard.status.${doc.status}`)}
                      </span>
                      <Link to={`/result/${doc.id}`} className="btn-secondary !py-1.5 !px-3 text-sm">
                        {t('dashboard.view')}
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id)}
                        className="btn-ghost !p-2 text-slate-400 hover:text-danger"
                        aria-label={t('dashboard.delete')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
