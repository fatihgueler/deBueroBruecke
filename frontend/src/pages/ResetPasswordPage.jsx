import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

export default function ResetPasswordPage() {
  const [done, setDone] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ new_password }) => {
    try {
      await api.post('/api/auth/reset-password', { token, new_password });
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Link ungültig oder abgelaufen.';
      toast.error(msg);
    }
  };

  if (!token) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="max-w-md w-full text-center">
          <p className="text-danger mb-4">Ungültiger Reset-Link.</p>
          <Link to="/forgot-password" className="btn-primary">Neuen Link anfordern</Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-slide-up">
        <Card>
          {!done ? (
            <>
              <h1 className="text-2xl font-extrabold text-white mb-1">Neues Passwort setzen</h1>
              <p className="text-slate-400 text-sm mb-6">Wähle ein neues sicheres Passwort.</p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                  <label className="label-field">Neues Passwort</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password" className="input-field pl-10" autoComplete="new-password"
                      {...register('new_password', { required: 'Pflichtfeld', minLength: { value: 8, message: 'Mindestens 8 Zeichen' } })}
                    />
                  </div>
                  {errors.new_password && <p className="mt-1.5 text-xs text-danger">{errors.new_password.message}</p>}
                </div>
                <div>
                  <label className="label-field">Passwort bestätigen</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password" className="input-field pl-10" autoComplete="new-password"
                      {...register('confirm', { required: 'Pflichtfeld', validate: v => v === watch('new_password') || 'Passwörter stimmen nicht überein' })}
                    />
                  </div>
                  {errors.confirm && <p className="mt-1.5 text-xs text-danger">{errors.confirm.message}</p>}
                </div>
                <Button type="submit" loading={isSubmitting} className="w-full py-3">
                  Passwort zurücksetzen
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Passwort gesetzt!</h2>
              <p className="text-slate-400 text-sm">Du wirst zur Anmeldung weitergeleitet…</p>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
