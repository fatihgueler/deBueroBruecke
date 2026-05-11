import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [devToken, setDevToken] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      const { data } = await api.post('/api/auth/forgot-password', { email: email.trim().toLowerCase() });
      setSent(true);
      if (data.dev_token) setDevToken(data.dev_token);
    } catch {
      setSent(true); // Immer success zeigen (kein User-Enumeration)
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-slide-up">
        <Link to="/login" className="btn-ghost mb-8 inline-flex text-sm">
          <ArrowLeft className="h-4 w-4" /> Zurück zur Anmeldung
        </Link>

        <Card>
          {!sent ? (
            <>
              <h1 className="text-2xl font-extrabold text-white mb-1">Passwort vergessen?</h1>
              <p className="text-slate-400 text-sm mb-6">
                Gib deine E-Mail-Adresse ein. Wir senden dir einen Reset-Link.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                  <label className="label-field">E-Mail-Adresse</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email" autoComplete="email" className="input-field pl-10"
                      {...register('email', { required: 'Pflichtfeld', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Ungültige E-Mail' } })}
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>}
                </div>
                <Button type="submit" loading={isSubmitting} className="w-full py-3">
                  Reset-Link anfordern
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">E-Mail gesendet!</h2>
              <p className="text-slate-400 text-sm mb-4">
                Falls ein Konto mit dieser E-Mail existiert, wurde ein Reset-Link gesendet.
              </p>
              {devToken && (
                <div className="mt-4 rounded-xl border border-warning/30 bg-warning/10 p-4 text-left">
                  <p className="text-xs font-bold text-warning mb-2">⚙ Entwickler-Modus (kein E-Mail-Versand)</p>
                  <p className="text-xs text-slate-400 mb-1">Dein Reset-Token:</p>
                  <code className="block break-all text-xs text-slate-200 bg-surface rounded p-2">{devToken}</code>
                  <Link to={`/reset-password?token=${devToken}`} className="btn-primary mt-3 text-xs py-2 w-full justify-center">
                    Jetzt Passwort zurücksetzen →
                  </Link>
                </div>
              )}
              <Link to="/login" className="btn-ghost mt-4 text-sm inline-flex">
                <ArrowLeft className="h-4 w-4" /> Zurück zur Anmeldung
              </Link>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
