import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Mail, Linkedin, CheckCircle2, Send, MessageSquare } from 'lucide-react';
import { api } from '../api/client';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const CATEGORIES = [
  'Allgemeine Anfrage',
  'Kooperation / NGO',
  'Presseanfrage',
  'Technischer Support',
  'Feedback',
  'Sonstiges',
];

export default function KontaktPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: '', email: '', category: 'Allgemeine Anfrage', message: '' },
  });

  const onSubmit = async (data) => {
    await api.post('/api/contact/', data);
    setSent(true);
  };

  return (
    <main className="flex-1">
      <section className="border-b border-border bg-surface-2/60">
        <div className="section-container max-w-4xl py-14">
          <Link to="/" className="btn-ghost mb-6 inline-flex text-sm"><ArrowLeft className="h-4 w-4" /> Startseite</Link>
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="h-7 w-7 text-primary-400" />
            <h1 className="text-4xl font-extrabold text-white">Kontakt</h1>
          </div>
          <p className="text-slate-400 max-w-xl">
            Fragen, Kooperationsanfragen, Feedback oder Pressekontakt — schreib uns direkt.
          </p>
        </div>
      </section>

      <div className="section-container max-w-4xl py-12">
        <div className="grid gap-10 lg:grid-cols-5">

          {/* Formular */}
          <div className="lg:col-span-3">
            {sent ? (
              <Card className="py-16 text-center animate-fade-in">
                <CheckCircle2 className="h-14 w-14 text-success mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Nachricht erhalten!</h2>
                <p className="text-slate-400 mb-6">
                  Danke für deine Nachricht. Wir melden uns so schnell wie möglich.
                </p>
                <Link to="/" className="btn-primary">Zurück zur Startseite</Link>
              </Card>
            ) : (
              <Card>
                <h2 className="text-xl font-bold text-white mb-6">Nachricht senden</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="label-field">Dein Name *</label>
                      <input type="text" className="input-field"
                        placeholder="Fatih Güler"
                        {...register('name', { required: 'Pflichtfeld', minLength: { value: 2, message: 'Mindestens 2 Zeichen' } })} />
                      {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="label-field">E-Mail-Adresse *</label>
                      <input type="email" className="input-field"
                        placeholder="name@beispiel.de"
                        {...register('email', { required: 'Pflichtfeld', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Ungültige E-Mail' } })} />
                      {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="label-field">Betreff / Kategorie</label>
                    <select className="input-field" {...register('category')}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="label-field">Nachricht *</label>
                    <textarea
                      rows={6} className="input-field resize-none"
                      placeholder="Deine Nachricht…"
                      {...register('message', { required: 'Pflichtfeld', minLength: { value: 10, message: 'Mindestens 10 Zeichen' } })}
                    />
                    {errors.message && <p className="mt-1.5 text-xs text-danger">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" loading={isSubmitting} className="w-full py-3">
                    <Send className="h-4 w-4" /> Nachricht senden
                  </Button>

                  <p className="text-xs text-slate-600 text-center">
                    Durch das Absenden stimmst du unserer{' '}
                    <Link to="/datenschutz" className="text-primary-400 hover:underline">Datenschutzerklärung</Link> zu.
                  </p>
                </form>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <h3 className="font-bold text-white mb-4">Direkte Kontaktmöglichkeiten</h3>
              <div className="space-y-4">
                <a href="mailto:kontakt@buerobruecke.de"
                  className="flex items-center gap-3 rounded-xl border border-border bg-card-2 px-4 py-3 text-sm transition hover:border-primary-500/40">
                  <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white">E-Mail</p>
                    <p className="text-xs text-slate-400">kontakt@buerobruecke.de</p>
                  </div>
                </a>
                <a href="https://www.linkedin.com/in/fatih-güler-0206a639a/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-[#0A66C2]/30 bg-[#0A66C2]/8 px-4 py-3 text-sm transition hover:border-[#0A66C2]/50">
                  <Linkedin className="h-5 w-5 text-[#5ba4e5] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white">LinkedIn</p>
                    <p className="text-xs text-slate-400">Fatih Mehmet Han Güler</p>
                  </div>
                </a>
              </div>
            </Card>

            <Card className="bg-primary-500/5 border-primary-500/20">
              <h3 className="font-bold text-white mb-3">Antwortzeit</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Wir antworten in der Regel innerhalb von <strong className="text-white">24–48 Stunden</strong>.
                Bei dringenden Anfragen bitte LinkedIn nutzen.
              </p>
            </Card>

            <Card>
              <h3 className="font-bold text-white mb-3">Häufige Anfragen</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Kooperation & NGO', to: '/ngo' },
                  { label: 'Presseanfragen', to: '/presse' },
                  { label: 'FAQ', to: '/faq' },
                ].map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-primary-400 hover:underline">{label} →</Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
