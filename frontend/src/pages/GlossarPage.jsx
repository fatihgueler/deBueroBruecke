import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen } from 'lucide-react';

const TERMS = [
  { term: 'Steuerbescheid', emoji: '📄', short: 'Finanzamt-Brief zur Steuer', de: 'Ein offizielles Schreiben vom Finanzamt, das dir mitteilt, wie viel Einkommensteuer du für ein bestimmtes Jahr zahlen musst oder zurückbekommst.', tr: 'Vergi dairesinin, belirli bir yıl için ne kadar gelir vergisi ödemen gerektiğini veya iade alacağını bildirdiği resmi bir mektup.', ar: 'خطاب رسمي من مكتب الضرائب يخبرك بمقدار ضريبة الدخل التي يجب دفعها أو استردادها لسنة معينة.', ru: 'Официальное письмо от налоговой инспекции с информацией о сумме подоходного налога за определённый год.', action: 'Frist beachten! Widerspruch möglich innerhalb von 1 Monat.' },
  { term: 'Mahnschreiben / Mahnung', emoji: '⚠️', short: 'Zahlungserinnerung', de: 'Eine Zahlungserinnerung von einer Behörde oder einem Unternehmen. Du hast eine Rechnung oder Schuld nicht bezahlt. Es können Mahngebühren anfallen.', tr: 'Bir kurum veya şirketten ödeme hatırlatması. Bir fatura veya borcu ödemediğin için gönderilir. Gecikme ücretleri eklenebilir.', ar: 'تذكير بالدفع من جهة حكومية أو شركة. لم تدفع فاتورة أو ديناً. قد تترتب عليه رسوم تأخير.', ru: 'Напоминание об оплате от ведомства или компании. Вы не оплатили счёт. Могут начисляться штрафы.', action: 'Sofort zahlen! Weiterer Verzug führt zu Inkasso oder Vollstreckung.' },
  { term: 'Widerspruch einlegen', emoji: '✍️', short: 'Gegen einen Bescheid protestieren', de: 'Du kannst schriftlich widersprechen, wenn du mit einem Bescheid nicht einverstanden bist. Die Frist beträgt meist 1 Monat. Der Widerspruch muss schriftlich erfolgen.', tr: 'Bir kararla aynı fikirde değilsen yazılı olarak itiraz edebilirsin. Süre genellikle 1 aydır. İtiraz yazılı yapılmalıdır.', ar: 'يمكنك الاعتراض كتابياً إذا لم تكن موافقاً على قرار ما. المهلة عادةً شهر واحد ويجب أن يكون الاعتراض خطياً.', ru: 'Вы можете письменно обжаловать решение, если не согласны с ним. Срок — как правило, 1 месяц.', action: 'Schriftlich + fristgerecht (1 Monat) + Begründung!' },
  { term: 'Ausländerbehörde', emoji: '🏛️', short: 'Amt für Aufenthaltsrecht', de: 'Die Behörde, die für Aufenthaltserlaubnisse und Visa für Ausländer zuständig ist. Hier musst du hin, wenn deine Aufenthaltserlaubnis abläuft oder du sie verlängern möchtest.', tr: 'Yabancıların oturma izinleri ve vizeleri için yetkili kurum. Oturma izninizin süresi doluyorsa buraya gitmeniz gerekiyor.', ar: 'الجهة المسؤولة عن تصاريح الإقامة والتأشيرات للأجانب. يجب التوجه إليها عند انتهاء تصريح الإقامة.', ru: 'Ведомство, ответственное за виды на жительство и визы для иностранцев.', action: 'Termin rechtzeitig buchen! Online-Terminbuchung verfügbar.' },
  { term: 'Jobcenter', emoji: '💼', short: 'Amt für Arbeitslose / Bürgergeld', de: 'Hier beantragst du Bürgergeld (früher Hartz IV / ALG II) wenn du arbeitslos bist oder zu wenig verdienst. Das Jobcenter hilft auch bei der Jobsuche.', tr: 'İşsizsen veya çok az kazanıyorsan buraya başvurabilirsin. Jobcenter, iş bulmada da yardımcı olur.', ar: 'هنا تتقدم بطلب للحصول على مساعدة مالية (Bürgergeld) إذا كنت عاطلاً أو تكسب أقل من الحد الأدنى.', ru: 'Здесь подаётся заявление на социальное пособие (Bürgergeld), если вы безработный или мало зарабатываете.', action: 'Alle 6 Monate zum Gespräch erscheinen. Mitwirkungspflicht!' },
  { term: 'Finanzamt', emoji: '💶', short: 'Steuerbehörde', de: 'Die Behörde, die Steuern erhebt. Du hast jedes Jahr Einkommensteuer zu zahlen. Das Finanzamt schickt dir den Steuerbescheid und verwaltet deine Steuerdaten.', tr: 'Vergi toplayan kurum. Her yıl gelir vergisi ödemek zorundasın. Finanzamt, vergi beyannamenizi yönetir.', ar: 'الجهة المختصة بجمع الضرائب. يجب دفع ضريبة الدخل كل عام. تُرسل إليك إشعار الضريبة.', ru: 'Налоговая инспекция. Ежегодно уплачивается подоходный налог. Финансовое ведомство управляет налоговыми данными.', action: 'Steuererklärung bis 31. Juli des Folgejahres abgeben (mit Steuerberater: bis Ende Februar).' },
  { term: 'Sozialamt', emoji: '🤝', short: 'Sozialhilfe / Grundsicherung', de: 'Das Sozialamt zahlt Sozialhilfe an Menschen, die keine anderen Sozialleistungen bekommen können. Auch zuständig für Pflege und Behindertenbeihilfen.', tr: 'Sosyal yardım ödemeleri yapan kuruluş. Diğer sosyal yardımlardan yararlanamayanlara destek sağlar.', ar: 'يدفع مساعدات اجتماعية للأشخاص الذين لا يستطيعون الاستفادة من مساعدات اجتماعية أخرى.', ru: 'Выплачивает социальную помощь людям, которые не могут получить другие социальные льготы.', action: 'Antrag stellen und Bedürftigkeit nachweisen.' },
  { term: 'BAMF', emoji: '🏠', short: 'Bundesamt für Migration und Flüchtlinge', de: 'Das BAMF ist zuständig für Asylverfahren in Deutschland. Es entscheidet, ob du Asyl, Flüchtlingsschutz oder subsidiären Schutz erhältst.', tr: 'BAMF, Almanya\'daki iltica prosedürlerinden sorumludur. Sığınma hakkı alıp alamayacağına karar verir.', ar: 'BAMF مسؤول عن إجراءات اللجوء في ألمانيا. يقرر ما إذا كنت ستحصل على حق اللجوء أو الحماية.', ru: 'BAMF отвечает за процедуры предоставления убежища. Он решает, будет ли предоставлено убежище.', action: 'Alle Termine und Fristen unbedingt einhalten!' },
  { term: 'Krankenkasse', emoji: '🏥', short: 'Gesetzliche Krankenversicherung', de: 'In Deutschland ist Krankenversicherung Pflicht. Die Krankenkasse übernimmt Arztkosten, Medikamente und Krankenhausaufenthalte. Du zahlst monatlich Beiträge.', tr: 'Almanya\'da sağlık sigortası zorunludur. Krankenkasse, doktor masraflarını, ilaçları ve hastane masraflarını karşılar.', ar: 'التأمين الصحي إلزامي في ألمانيا. صندوق المرض يغطي تكاليف الطبيب والأدوية والمستشفى.', ru: 'В Германии медицинское страхование обязательно. Касса покрывает расходы на врача, лекарства и госпитализацию.', action: 'Sofort nach Einreise anmelden! Sonst keine Arztbesuche möglich.' },
  { term: 'Einschreiben', emoji: '📮', short: 'Eingeschriebener Brief', de: 'Ein Einschreiben ist ein Brief, den du unterschreiben musst, wenn du ihn empfängst. Behörden nutzen dies, um zu beweisen, dass du den Brief erhalten hast. Wichtig für Fristen.', tr: 'Teslim aldığında imzalamanı gerektiren bir mektuptur. Kurumlar, mektubu aldığını kanıtlamak için kullanır.', ar: 'خطاب مسجل يجب عليك التوقيع عليه عند استلامه. تستخدمه الجهات الحكومية لإثبات أنك استلمت الخطاب.', ru: 'Заказное письмо, которое вы подписываете при получении. Используется ведомствами как доказательство получения.', action: 'Unterschreibe nur, wenn du das Schreiben wirklich annehmen willst. Ablehnen ist möglich.' },
  { term: 'Aufenthaltserlaubnis', emoji: '📋', short: 'Erlaubnis zum Wohnen in Deutschland', de: 'Ein offizieller Aufenthaltsstatus, der dir erlaubt, in Deutschland zu wohnen und (meist) zu arbeiten. Muss regelmäßig verlängert werden bei der Ausländerbehörde.', tr: 'Almanya\'da yaşamanıza ve (genellikle) çalışmanıza izin veren resmi bir oturma statüsü. Yabancılar dairesinde düzenli olarak yenilenmesi gerekir.', ar: 'وضع إقامة رسمي يتيح لك العيش والعمل في ألمانيا. يجب تجديده بانتظام في مكتب شؤون الأجانب.', ru: 'Официальный статус, разрешающий проживание в Германии. Требует регулярного продления.', action: 'Verlängerung mindestens 6 Wochen vor Ablauf beantragen!' },
  { term: 'Zwangsräumung / Vollstreckung', emoji: '🔴', short: 'Behördliche Zwangsmaßnahme', de: 'Wenn du Schulden nicht zahlst oder Bescheide ignorierst, kann eine Behörde Vollstreckungsmaßnahmen einleiten — bis hin zur Pfändung von Konto oder Lohn.', tr: 'Borçları ödemezsen veya bildirimleri görmezden gelirsen, banka hesabının veya maaşının haczi dahil icra işlemleri başlatılabilir.', ar: 'إذا لم تسدد الديون أو تجاهلت الإشعارات، يمكن للجهة الحكومية البدء في إجراءات التنفيذ بما في ذلك الحجز على الحساب.', ru: 'Если не оплачивать долги или игнорировать уведомления, может быть начато исполнительное производство вплоть до ареста счёта.', action: 'Sofort Beratung suchen! Schuldnerberatung hilft kostenlos.' },
];

const LANG_LABELS = { de: 'Deutsch', tr: 'Türkçe', ar: 'العربية', ru: 'Русский' };

export default function GlossarPage() {
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState('de');

  const filtered = TERMS.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.short.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex-1">
      <section className="border-b border-border bg-surface-2/60">
        <div className="section-container max-w-4xl py-14">
          <Link to="/" className="btn-ghost mb-6 inline-flex text-sm"><ArrowLeft className="h-4 w-4" /> Startseite</Link>
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="h-7 w-7 text-primary-400" />
            <h1 className="text-4xl font-extrabold text-white">Behörden-Glossar</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Die wichtigsten deutschen Behördenbegriffe einfach erklärt — auf Deutsch, Türkisch, Arabisch und Russisch.
          </p>
          <p className="mt-1 text-xs text-slate-500">{TERMS.length} Begriffe · Kostenlos · Für Einwanderer und Geflüchtete</p>
        </div>
      </section>

      <div className="section-container max-w-4xl py-10">
        {/* Suche + Sprache */}
        <div className="flex flex-col gap-3 sm:flex-row mb-8">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text" placeholder="Begriff suchen …" value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            {Object.entries(LANG_LABELS).map(([code, label]) => (
              <button key={code} type="button" onClick={() => setLang(code)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${lang === code ? 'border-primary-500 bg-primary-500/15 text-primary-300' : 'border-border bg-card text-slate-400 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Begriffe */}
        <div className="space-y-4">
          {filtered.map(item => (
            <div key={item.term} className="card-base">
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-3 mb-1">
                    <h2 className="text-lg font-bold text-white">{item.term}</h2>
                    <span className="text-sm text-slate-400">{item.short}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300 mb-3" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {item[lang] || item.de}
                  </p>
                  <div className="flex items-start gap-2 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2">
                    <span className="text-warning text-xs font-bold flex-shrink-0 mt-0.5">→</span>
                    <p className="text-xs text-warning/90">{item.action}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">Kein Begriff gefunden.</div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-primary-500/20 bg-primary-500/5 p-8 text-center">
          <p className="text-white font-semibold mb-2">Hast du einen Behördenbrief bekommen?</p>
          <p className="text-slate-400 text-sm mb-4">Lade ihn hoch — BüroBrücke erklärt ihn sofort in deiner Sprache.</p>
          <Link to="/register" className="btn-primary">Kostenlos starten</Link>
        </div>
      </div>
    </main>
  );
}
