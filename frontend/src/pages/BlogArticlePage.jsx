import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Calendar, Tag } from 'lucide-react';
import { ARTICLES } from '../data/blogArticles';

function renderContent(text) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    // Bold
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="mb-2">
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-white">{p}</strong> : p)}
      </p>
    );
  });
}

export default function BlogArticlePage() {
  const { slug } = useParams();
  const article = ARTICLES.find(a => a.slug === slug);
  if (!article) return <Navigate to="/blog" replace />;

  const idx = ARTICLES.indexOf(article);
  const prev = ARTICLES[idx - 1];
  const next = ARTICLES[idx + 1];

  return (
    <main className="flex-1">
      {/* Header */}
      <section className="border-b border-border bg-surface-2/60">
        <div className="section-container max-w-3xl py-14">
          <Link to="/blog" className="btn-ghost mb-6 inline-flex text-sm">
            <ArrowLeft className="h-4 w-4" /> Alle Artikel
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="badge badge-primary">{article.category}</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5" />{article.readMin} min Lesezeit
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              {new Intl.DateTimeFormat('de-DE', { dateStyle: 'long' }).format(new Date(article.date))}
            </span>
          </div>
          <div className="text-5xl mb-4">{article.emoji}</div>
          <h1 className="text-4xl font-extrabold text-white mb-3 text-balance">{article.title}</h1>
          <p className="text-lg text-slate-400">{article.subtitle}</p>
        </div>
      </section>

      {/* Artikel-Content */}
      <div className="section-container max-w-3xl py-12">
        <article className="space-y-10">
          {article.sections.map((sec, i) => (
            <section key={i}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary-500/15 text-primary-400 text-sm font-bold">{i + 1}</span>
                {sec.heading}
              </h2>
              <div className="text-slate-300 text-sm leading-7">
                {renderContent(sec.content)}
              </div>
            </section>
          ))}
        </article>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-primary-500/20 bg-primary-500/5 p-8 text-center">
          <p className="text-xl font-bold text-white mb-2">
            Hast du einen Brief von der {article.category} bekommen?
          </p>
          <p className="text-slate-400 text-sm mb-6">
            Lade ihn bei BüroBrücke hoch — in Sekunden klare Erklärung in deiner Sprache.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary">Kostenlos registrieren</Link>
            <Link to="/demo" className="btn-secondary">Demo ansehen</Link>
          </div>
        </div>

        {/* Prev / Next Navigation */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 border-t border-border pt-8">
          {prev ? (
            <Link to={`/blog/${prev.slug}`} className="card-hover group">
              <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Vorheriger Artikel</p>
              <p className="font-semibold text-white group-hover:text-primary-300 text-sm">{prev.emoji} {prev.title}</p>
            </Link>
          ) : <div />}
          {next && (
            <Link to={`/blog/${next.slug}`} className="card-hover group text-right">
              <p className="text-xs text-slate-500 mb-1 flex items-center justify-end gap-1">Nächster Artikel <ArrowRight className="h-3 w-3" /></p>
              <p className="font-semibold text-white group-hover:text-primary-300 text-sm">{next.emoji} {next.title}</p>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
