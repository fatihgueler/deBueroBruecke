import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';
import { SUPPORTED_LANGUAGES } from '../i18n';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      preferred_language: i18n.language || 'de',
    },
  });

  const onSubmit = async (values) => {
    try {
      await registerUser(
        values.email.trim().toLowerCase(),
        values.password,
        values.preferred_language,
      );
      navigate('/upload', { replace: true });
    } catch (error) {
      toast.error(extractErrorMessage(error, t('auth.errors.registerFailed')));
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white">{t('auth.registerTitle')}</h1>
        <p className="mt-1 text-sm text-slate-400">{t('auth.registerSubtitle')}</p>

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
              autoComplete="new-password"
              className="input-field"
              {...register('password', {
                required: t('auth.errors.required'),
                minLength: { value: 8, message: t('auth.errors.passwordTooShort') },
              })}
            />
            {errors.password ? (
              <p className="mt-1 text-sm text-danger">{errors.password.message}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">{t('auth.passwordHint')}</p>
            )}
          </div>

          <div>
            <label htmlFor="preferred_language" className="label-field">
              {t('auth.language')}
            </label>
            <select
              id="preferred_language"
              className="input-field"
              {...register('preferred_language')}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" loading={isSubmitting} className="w-full">
            {t('auth.register')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="text-primary-500 hover:underline">
            {t('auth.loginNow')}
          </Link>
        </p>
      </Card>
    </main>
  );
}
