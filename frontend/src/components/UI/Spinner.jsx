import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 24, label, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-slate-300 ${className}`}>
      <Loader2 className="animate-spin text-primary-500" style={{ width: size, height: size }} />
      {label ? <span className="text-sm">{label}</span> : null}
    </div>
  );
}
