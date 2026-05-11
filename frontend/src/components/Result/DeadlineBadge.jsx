import { useTranslation } from 'react-i18next';
import { AlertTriangle, AlertOctagon, AlertCircle, Info } from 'lucide-react';

const URGENCY_STYLES = {
  low: { bg: 'bg-success/15', text: 'text-success', icon: Info, pulse: false },
  medium: { bg: 'bg-warning/15', text: 'text-warning', icon: AlertCircle, pulse: false },
  high: { bg: 'bg-orange-500/15', text: 'text-orange-400', icon: AlertTriangle, pulse: false },
  critical: { bg: 'bg-danger/15', text: 'text-danger', icon: AlertOctagon, pulse: true },
};

function formatDate(value, locale) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(value));
  } catch {
    return value;
  }
}

function daysUntil(value) {
  if (!value) return null;
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function DeadlineBadge({ deadline, urgency = 'medium' }) {
  const { t, i18n } = useTranslation();
  const style = URGENCY_STYLES[urgency] || URGENCY_STYLES.medium;
  const Icon = style.icon;
  const formatted = formatDate(deadline, i18n.language);
  const days = daysUntil(deadline);

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium ${style.bg} ${style.text} ${
        style.pulse ? 'animate-pulse-critical' : ''
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{t(`result.urgency.${urgency}`)}</span>
      {formatted ? (
        <>
          <span className="opacity-50">·</span>
          <span>{formatted}</span>
          {typeof days === 'number' && days >= 0 ? (
            <span className="opacity-70">({days}d)</span>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
