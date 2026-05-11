import { CheckCircle2 } from 'lucide-react';

export default function ActionSteps({ text }) {
  const steps = (text || '')
    .split(/\n+|(?<=[.!?])\s+(?=[A-ZÄÖÜ])/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (steps.length === 0) return null;

  return (
    <ol className="space-y-3">
      {steps.map((step, idx) => (
        <li key={idx} className="flex gap-3">
          <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-primary-500/20 text-xs font-bold text-primary-500">
            {idx + 1}
          </span>
          <span className="text-slate-200">{step}</span>
        </li>
      ))}
      <li className="flex gap-3 text-sm text-success">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
        <span className="opacity-70">Fertig.</span>
      </li>
    </ol>
  );
}
