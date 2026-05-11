import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  FileText, Trash2, Plus, FileImage, FileType2,
  Eye, Clock, CheckCircle2, AlertCircle, UploadCloud,
} from 'lucide-react';

import { documentsApi, extractErrorMessage } from '../api/client';
import Card from '../components/UI/Card';
import Spinner from '../components/UI/Spinner';

const STATUS_CONFIG = {
  pending:  { label: 'dashboard.status.pending',  cls: 'badge-warning',  Icon: Clock         },
  analyzed: { label: 'dashboard.status.analyzed', cls: 'badge-success',  Icon: CheckCircle2  },
  error:    { label: 'dashboard.status.error',     cls: 'badge-danger',   Icon: AlertCircle   },
};

function formatDate(value, locale) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    documentsApi
      .list()
      .then((res) => setDocuments(res.data))
      .catch((err) => toast.error(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('dashboard.deleteConfirm'))) return;
    setDeletingId(id);
    try {
      await documentsApi.remove(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="page-container">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('dashboard.title')}</h1>
          <p className="mt-1 text-slate-400">{t('dashboard.subtitle')}</p>
        </div>
        <Link to="/upload" className="btn-primary">
          <Plus className="h-4 w-4" />
          {t('dashboard.newUpload')}
        </Link>
      </div>

      {/* Stats strip */}
      {!loading && documents.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Gesamt',       value: documents.length,                                    cls: 'text-slate-200' },
            { label: 'Analysiert',   value: documents.filter(d => d.status === 'analyzed').length, cls: 'text-success'   },
            { label: 'Ausstehend',   value: documents.filter(d => d.status === 'pending').length,  cls: 'text-warning'   },
          ].map(({ label, value, cls }) => (
            <div key={label} className="card-base text-center py-4">
              <p className={`text-2xl font-extrabold ${cls}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Document list */}
      {loading ? (
        <Spinner label={t('common.loading')} className="py-20" />
      ) : documents.length === 0 ? (
        <Card className="py-20 text-center animate-fade-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-card-2 border border-border">
            <UploadCloud className="h-8 w-8 text-slate-500" />
          </div>
          <p className="text-lg font-semibold text-slate-300">{t('dashboard.empty')}</p>
          <p className="mt-1 text-sm text-slate-500">Lade deinen ersten Behördenbrief hoch.</p>
          <Link to="/upload" className="btn-primary mt-6 inline-flex">
            <Plus className="h-4 w-4" />
            {t('dashboard.newUpload')}
          </Link>
        </Card>
      ) : (
        <ul className="grid gap-3 animate-fade-in">
          {documents.map((doc) => {
            const FileIcon = doc.file_type === 'pdf' ? FileType2 : FileImage;
            const statusCfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusCfg.Icon;
            const isDeleting = deletingId === doc.id;

            return (
              <li key={doc.id}>
                <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between transition-all hover:border-primary-500/20 hover:shadow-card-hover">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-card-2 border border-border text-primary-400">
                      <FileIcon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{doc.original_filename}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatDate(doc.created_at, i18n.language)}
                      </p>
                      {doc.analysis && (
                        <p className="mt-1 text-xs text-slate-400">
                          <span className="font-medium text-slate-300">{doc.analysis.authority_type}</span>
                          {' · '}
                          {doc.analysis.letter_type}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`badge ${statusCfg.cls}`}>
                      <StatusIcon className="h-3 w-3" />
                      {t(statusCfg.label)}
                    </span>

                    <Link
                      to={`/result/${doc.id}`}
                      className="btn-secondary !py-1.5 !px-3 text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {t('dashboard.view')}
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id)}
                      disabled={isDeleting}
                      className="btn-ghost !p-2 text-slate-500 hover:text-danger transition-colors disabled:opacity-50"
                      aria-label={t('dashboard.delete')}
                    >
                      {isDeleting ? (
                        <Spinner size={16} />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
