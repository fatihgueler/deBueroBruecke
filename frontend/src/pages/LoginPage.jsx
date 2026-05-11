import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email.trim().toLowerCase(), password);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(extractErrorMessage(error, t('auth.errors.loginFailed')));
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-slide-up">
        {/* Brand mark */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 shadow-glow">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M4 22 Q16 10 28 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <line x1="9"  y1="22" x2="9"  y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="23" y1="22" x2="23" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="4"  y1="22" x2="28" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-white">{t('auth.loginTitle')}</h1>
          <p className="mt-1.5 text-sm text-slate-400">{t('auth.loginSubtitle')}</p>
        </div>

        <Card>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label htmlFor="email" className="label-field">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="input-field pl-10"
                  {...register('email', {
                    required: t('auth.errors.required'),
                    pattern:  { value: /^\S+@\S+\.\S+$/, message: t('auth.errors.emailInvalid') },
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label-field">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="input-field pl-10"
                  {...register('password', { required: t('auth.errors.required') })}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-danger">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" loading={isSubmitting} className="w-full py-3">
              {t('auth.login')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
              {t('auth.registerNow')}
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
