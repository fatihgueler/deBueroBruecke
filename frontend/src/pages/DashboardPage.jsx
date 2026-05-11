import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  FileText, Trash2, Plus, FileImage, FileType2,
  Eye, Clock, CheckCircle2, AlertCircle, UploadCloud,
  Calendar, AlertTriangle, List,
} from 'lucide-react';

import { documentsApi, extractErrorMessage } from '../api/client';
import Card from '../components/UI/Card';
import Spinner from '../components/UI/Spinner';

const STATUS_CONFIG = {
  pending:  { label: 'dashboard.status.pending',  cls: 'badge-warning',  Icon: Clock        },
  analyzed: { label: 'dashboard.status.analyzed', cls: 'badge-success',  Icon: CheckCircle2 },
  error:    { label: 'dashboard.status.error',     cls: 'badge-danger',   Icon: AlertCircle  },
};

function formatDate(value, locale) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch { return value; }
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

function DeadlineList({ documents }) {
  const { t, i18n } = useTranslation();
  const withDeadline = documents
    .filter(d => d.analysis?.deadline)
    .map(d => ({ ...d, days: daysUntil(d.analysis.deadline) }))
    .sort((a, b) => a.days - b.days);

  if (withDeadline.length === 0) {
    return (
      <Card className="py-16 text-center">
        <Calendar className="mx-auto h-12 w-12 text-slate-600" />
        <p className="mt-4 text-slate-400">Keine Fristen aus analysierten Briefen vorhanden.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {withDeadline.map(doc => {
        const days = doc.days;
        const urgency = days <= 3 ? 'danger' : days <= 7 ? 'warning' : days <= 14 ? 'warning' : 'success';
        const urgencyBadge = days <= 3 ? 'badge-danger' : days <= 7 ? 'badge-warning' : 'badge-neutral';
        return (
          <Card key={doc.id} className={`border-l-4 ${urgency === 'danger' ? 'border-l-danger' : urgency === 'warning' ? 'border-l-warning' : 'border-l-success'}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-white truncate">{doc.original_filename}</p>
                <p className="text-sm text-slate-400 mt-0.5">
                  {doc.analysis.authority_type} · {doc.analysis.letter_type}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Frist: <strong className="text-slate-300">
                    {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long' }).format(new Date(doc.analysis.deadline))}
                  </strong>
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`badge ${urgencyBadge} whitespace-nowrap`}>
                  {days > 0 ? `Noch ${days} Tag${days !== 1 ? 'e' : ''}` : days === 0 ? 'Heute!' : `${Math.abs(days)} Tage überfällig`}
                </span>
                <Link to={`/result/${doc.id}`} className="btn-secondary !py-1.5 !px-3 text-xs">
                  <Eye className="h-3.5 w-3.5" /> {t('dashboard.view')}
                </Link>
              </div>
            </div>
            {days <= 3 && days >= 0 && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-danger/20 bg-danger/10 px-3 py-2 text-xs text-danger">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Dringende Handlung erforderlich! Frist läuft bald ab.
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [view, setView] = useState('list');

  useEffect(() => {
    documentsApi.list()
      .then(res => setDocuments(res.data))
      .catch(err => toast.error(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('dashboard.deleteConfirm'))) return;
    setDeletingId(id);
    try {
      await documentsApi.remove(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const upcomingCount = documents.filter(d => {
    const days = daysUntil(d.analysis?.deadline);
    return days !== null && days >= 0 && days <= 7;
  }).length;

  return (
    <main className="page-container">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('dashboard.title')}</h1>
          <p className="mt-1 text-slate-400">{t('dashboard.subtitle')}</p>
        </div>
        <Link to="/upload" className="btn-primary">
          <Plus className="h-4 w-4" /> {t('dashboard.newUpload')}
        </Link>
      </div>

      {/* Stats */}
      {!loading && documents.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Gesamt', value: documents.length, cls: 'text-slate-200' },
            { label: 'Analysiert', value: documents.filter(d => d.status === 'analyzed').length, cls: 'text-success' },
            { label: 'Fristen (7 Tage)', value: upcomingCount, cls: upcomingCount > 0 ? 'text-warning' : 'text-slate-400' },
          ].map(({ label, value, cls }) => (
            <Card key={label} className="py-4 text-center">
              <p className={`text-2xl font-extrabold ${cls}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </Card>
          ))}
        </div>
      )}

      {/* View Toggle */}
      {!loading && documents.length > 0 && (
        <div className="flex gap-2 mb-6">
          {[{ key: 'list', icon: List, label: 'Briefe' }, { key: 'calendar', icon: Calendar, label: 'Fristen' }].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition
                ${view === key ? 'border-primary-500 bg-primary-500/15 text-primary-300' : 'border-border bg-card text-slate-400 hover:text-white'}`}
            >
              <Icon className="h-4 w-4" /> {label}
              {key === 'calendar' && upcomingCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-warning text-xs font-bold text-surface">
                  {upcomingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Spinner label={t('common.loading')} className="py-20" />
      ) : documents.length === 0 ? (
        <Card className="py-20 text-center animate-fade-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-card-2 border border-border">
            <UploadCloud className="h-8 w-8 text-slate-500" />
          </div>
          <p className="text-lg font-semibold text-slate-300">{t('dashboard.empty')}</p>
          <Link to="/upload" className="btn-primary mt-6 inline-flex">
            <Plus className="h-4 w-4" /> {t('dashboard.newUpload')}
          </Link>
        </Card>
      ) : view === 'calendar' ? (
        <DeadlineList documents={documents} />
      ) : (
        <ul className="grid gap-3 animate-fade-in">
          {documents.map(doc => {
            const FileIcon = doc.file_type === 'pdf' ? FileType2 : FileImage;
            const cfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.pending;
            const StatusIcon = cfg.Icon;
            const isDeleting = deletingId === doc.id;
            return (
              <li key={doc.id}>
                <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between transition-all hover:border-primary-500/20">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-card-2 border border-border text-primary-400">
                      <FileIcon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{doc.original_filename}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{formatDate(doc.created_at, i18n.language)}</p>
                      {doc.analysis && (
                        <p className="mt-1 text-xs text-slate-400">
                          <span className="font-medium text-slate-300">{doc.analysis.authority_type}</span>
                          {' · '}{doc.analysis.letter_type}
                          {doc.analysis.deadline && (
                            <span className={`ml-2 font-semibold ${daysUntil(doc.analysis.deadline) <= 7 ? 'text-warning' : 'text-slate-400'}`}>
                              · Frist: {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'short' }).format(new Date(doc.analysis.deadline))}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`badge ${cfg.cls}`}><StatusIcon className="h-3 w-3" />{t(cfg.label)}</span>
                    <Link to={`/result/${doc.id}`} className="btn-secondary !py-1.5 !px-3 text-xs">
                      <Eye className="h-3.5 w-3.5" /> {t('dashboard.view')}
                    </Link>
                    <button type="button" onClick={() => handleDelete(doc.id)} disabled={isDeleting}
                      className="btn-ghost !p-2 text-slate-500 hover:text-danger disabled:opacity-50" aria-label={t('dashboard.delete')}>
                      {isDeleting ? <Spinner size={16} /> : <Trash2 className="h-4 w-4" />}
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
