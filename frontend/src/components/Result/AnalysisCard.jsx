import Card from '../UI/Card';

export default function AnalysisCard({ icon: Icon, title, children, accent = 'primary', className = '' }) {
  const accentColor =
    accent === 'danger'
      ? 'text-danger'
      : accent === 'warning'
        ? 'text-warning'
        : accent === 'success'
          ? 'text-success'
          : 'text-primary-500';

  return (
    <Card className={className}>
      <div className="flex items-center gap-3">
        {Icon ? (
          <span className={`grid h-10 w-10 place-items-center rounded-lg bg-slate-800 ${accentColor}`}>
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="mt-4 text-slate-200 leading-relaxed">{children}</div>
    </Card>
  );
}
