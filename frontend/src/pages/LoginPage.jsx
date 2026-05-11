import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email.trim().toLowerCase(), password);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(extractErrorMessage(error, t('auth.errors.loginFailed')));
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white">{t('auth.loginTitle')}</h1>
        <p className="mt-1 text-sm text-slate-400">{t('auth.loginSubtitle')}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="email" className="label-field">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="input-field"
              {...register('email', {
                required: t('auth.errors.required'),
                pattern: { value: /^\S+@\S+\.\S+$/, message: t('auth.errors.emailInvalid') },
              })}
            />
            {errors.email ? (
              <p className="mt-1 text-sm text-danger">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="label-field">
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="input-field"
              {...register('password', { required: t('auth.errors.required') })}
            />
            {errors.password ? (
              <p className="mt-1 text-sm text-danger">{errors.password.message}</p>
            ) : null}
          </div>

          <Button type="submit" loading={isSubmitting} className="w-full">
            {t('auth.login')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-primary-500 hover:underline">
            {t('auth.registerNow')}
          </Link>
        </p>
      </Card>
    </main>
  );
}
