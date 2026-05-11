import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, BookOpen } from 'lucide-react';
import { ARTICLES } from '../data/blogArticles';

export default function BlogPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-border bg-surface-2/60">
        <div className="section-container max-w-4xl py-14">
          <Link to="/" className="btn-ghost mb-6 inline-flex text-sm"><ArrowLeft className="h-4 w-4" /> Startseite</Link>
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="h-7 w-7 text-primary-400" />
            <h1 className="text-4xl font-extrabold text-white">Ratgeber & Blog</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Verständliche Erklärungen zu deutschen Behörden, Fristen und Rechten — für Einwanderer und Geflüchtete.
          </p>
        </div>
      </section>

      <div className="section-container max-w-4xl py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map(a => (
            <Link key={a.slug} to={`/blog/${a.slug}`}
              className="card-hover group flex flex-col no-underline">
              <div className="text-4xl mb-4">{a.emoji}</div>
              <span className="badge badge-primary mb-2 self-start">{a.category}</span>
              <h2 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                {a.title}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed flex-1">{a.subtitle}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />{a.readMin} min
                </span>
                <span className="flex items-center gap-1 text-primary-400 group-hover:gap-2 transition-all">
                  Lesen <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-primary-500/20 bg-primary-500/5 p-8 text-center">
          <p className="text-white font-semibold mb-2">Hast du einen Behördenbrief bekommen?</p>
          <p className="text-slate-400 text-sm mb-4">BüroBrücke analysiert deinen Brief sofort in deiner Sprache.</p>
          <Link to="/demo" className="btn-primary">Kostenlos ausprobieren</Link>
        </div>
      </div>
    </main>
  );
}
