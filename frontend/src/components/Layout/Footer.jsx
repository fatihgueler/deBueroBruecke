import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-slate-800 bg-surface py-6 text-center text-sm text-slate-500">
      <p>{t('footer.rights')}</p>
      <p className="mt-1">{t('footer.disclaimer')}</p>
    </footer>
  );
}
