import { Intro, Breadcrumb, Source } from '@/components/UI';
import AdmissionsExplorer from '@/components/AdmissionsExplorer';
import { checked } from '@/data/content';
export const metadata = { title: 'Admissions explorer' };
const faqs = [
  [
    'Where do I apply?',
    'Apply only through the admissions portal linked from LNMIIT’s official website. This heritage project helps you explore; it does not accept applications.',
    '/admissions/',
  ],
  [
    'How does regular undergraduate admission work?',
    'The regular UG route uses JEE (Main). The official regular-mode page explains eligibility, merit preparation, seats and the current application process.',
    '/admissions/ug/regular-mode/',
  ],
  [
    'Where can I check fees, scholarships and deadlines?',
    'Use the official admissions page for your programme level. Fee schedules, financial support and important dates can differ by programme and admission round.',
    '/admissions/',
  ],
  [
    'Are postgraduate science programmes available?',
    'LNMIIT lists M.Sc. in Physics and M.Sc. in Mathematics and Computing. The PG science admissions page explains the available selection routes.',
    '/admissions/pg-science/',
  ],
];
export default function Admissions() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Admissions' }]} />
      <Intro
        number="04"
        title={
          <>
            Your curiosity.
            <br />
            <em>Your next chapter.</em>
          </>
        }
        description="Find a starting point for your academic journey. Explore the pathways, then continue to LNMIIT’s official portal for the details that matter."
      />
      <section className="wrap section compact">
        <AdmissionsExplorer />
        <div className="admission-note">
          <span aria-hidden="true">ⓘ</span>
          <p>
            Programme overview checked against official pages on {checked}.
            Eligibility, fees, seats, financial support and deadlines are
            governed by the latest official notices.
          </p>
        </div>
      </section>
      <section className="journey">
        <div className="wrap">
          <p className="eyebrow">A SIMPLE WAY TO GET STARTED</p>
          <h2>From exploring to applying.</h2>
          <ol className="steps">
            {[
              [
                'Find your programme',
                'Choose a level and explore the subject that interests you.',
              ],
              [
                'Read the requirements',
                'Check eligibility, admission mode, fees and financial support.',
              ],
              [
                'Follow the official process',
                'Use the linked LNMIIT portal and track its current notices.',
              ],
            ].map(([t, d], i) => (
              <li key={t}>
                <span>0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="wrap section faq-layout">
        <div>
          <p className="eyebrow">A FEW USEFUL ANSWERS</p>
          <h2>Before you begin.</h2>
          <Source href="/admissions/ug/faqs/" label="All official UG FAQs" />
        </div>
        <div className="faq">
          {faqs.map(([q, a, s]) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{a}</p>
              <Source href={s} />
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
