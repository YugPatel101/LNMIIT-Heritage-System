import Link from 'next/link';
import { Breadcrumb, Intro } from '@/components/UI';
import ClubExplorer from '@/components/ClubExplorer';
import {
  brochure2015,
  campusEvents,
  clubs,
  councils,
  earlierActivities,
  gymkhana,
  gymkhanaPage,
  gymkhanaSite,
  majorEvents,
  studentBodies,
} from '@/data/student-life';
export const metadata = {
  title: 'Student life',
  description:
    'LNMIIT’s clubs, societies and Students’ Gymkhana, and the five major events they build each year.',
};
function External({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}
function Chips({ items }) {
  return (
    <ul className="sl-chips">
      {items.map((h) => (
        <li key={h}>{h}</li>
      ))}
    </ul>
  );
}
export default function StudentLife() {
  const [flagship, ...others] = majorEvents;
  return (
    <>
      <Breadcrumb items={[{ label: 'Student life' }]} />
      <Intro
        number="06"
        title={
          <>
            Run by students.
            <br />
            <em>Open to all of them.</em>
          </>
        }
        description="The clubs and communities that drive campus life, the Students’ Gymkhana behind them, and the major events they build each year."
      />
      <nav className="sl-jump wrap" aria-label="On this page">
        <a href="#clubs">Clubs & communities</a>
        <a href="#societies">Societies & chapters</a>
        <a href="#gymkhana">Students’ Gymkhana</a>
        <a href="#major-events">Major events</a>
      </nav>

      <section className="wrap section sl-section" id="clubs">
        <p className="eyebrow">
          CLUBS & COMMUNITIES · {clubs.length} CLUBS AND COMMITTEES
        </p>
        <h2>Find your people.</h2>
        <ul className="sl-councils">
          {councils.map((c) => (
            <li key={c.id}>
              <h3>{c.name}</h3>
              <p>{c.text}</p>
              <External href={`${gymkhanaSite}/${c.slug}`}>
                Council page
              </External>
            </li>
          ))}
        </ul>
        <ClubExplorer />
        <p className="sl-note">
          The list follows the Student Gymkhana website. Each card opens that
          club’s official page, which names its current coordinators.
          Descriptions come from LNMIIT sources where available, and some date
          from the 2015–16 Institute Brochure.
        </p>
      </section>

      <section className="wrap section sl-section" id="societies">
        <p className="eyebrow">BEYOND THE COUNCILS</p>
        <h2>Societies, chapters and student bodies.</h2>
        <ul className="sl-bodies">
          {studentBodies.map((b) => (
            <li key={b.name}>
              <a href={b.href} target="_blank" rel="noreferrer">
                <span className="eyebrow">{b.kind}</span>
                <h3>{b.name}</h3>
                <p>{b.text}</p>
                <small>
                  Official page <span aria-hidden="true">↗</span>
                </small>
              </a>
            </li>
          ))}
        </ul>
        <h3 className="sl-subhead">Also named in earlier sources</h3>
        <ul className="sl-earlier">
          {earlierActivities.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <p className="sl-note">
          These activities appear in the{' '}
          <External href={brochure2015}>2015–16 Institute Brochure</External> or
          LNMIIT’s admissions pages. They are not on the current Gymkhana list,
          so they may have changed or merged.
        </p>
      </section>

      <section className="wrap section sl-section" id="gymkhana">
        <p className="eyebrow">THE STUDENTS’ GYMKHANA</p>
        <h2>“{gymkhana.philosophy}”</h2>
        <p className="sl-lead">{gymkhana.purpose}</p>
        <ul className="sl-structure">
          {gymkhana.structure.map((s) => (
            <li key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ul>
        <h3 className="sl-subhead">Reach the Gymkhana</h3>
        <ul className="sl-contacts">
          {gymkhana.contacts.map(([role, email]) => (
            <li key={email}>
              <span>{role}</span>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
          ))}
        </ul>
        <div className="sl-links">
          <External href={gymkhanaSite}>Student Gymkhana website</External>
          <External href={gymkhanaPage}>
            Constitution & Senate on lnmiit.ac.in
          </External>
        </div>
      </section>

      <section
        className="wrap section sl-section sl-events-section"
        id="major-events"
      >
        <p className="eyebrow">WHAT THESE COMMUNITIES BUILD</p>
        <h2>Major Events at LNMIIT</h2>
        <p className="sl-lead">
          Five events anchor the campus year, each one run by students. E-Summit
          is the flagship.
        </p>
        <Link
          className="sl-feature"
          id="e-summit"
          href={`/student-life/events/${flagship.id}/`}
          aria-label={`Explore ${flagship.name}`}
        >
          <img src={flagship.image} alt={flagship.alt} />
          <div>
            <span className="eyebrow">{flagship.kind}</span>
            <h3>{flagship.name}</h3>
            <small>{flagship.edition}</small>
            <p>{flagship.summary}</p>
            <Chips items={flagship.highlights} />
            <span className="sl-explore">Explore E-Summit →</span>
          </div>
        </Link>
        <ol className="sl-event-grid">
          {others.map((e) => (
            <li key={e.id}>
              <Link
                href={`/student-life/events/${e.id}/`}
                aria-label={`Explore ${e.name}`}
              >
                <img src={e.image} alt={e.alt} loading="lazy" />
                <span className="eyebrow">{e.kind}</span>
                <h3>{e.name}</h3>
                <small>{e.edition}</small>
                <p>{e.summary}</p>
                <Chips items={e.highlights} />
                <span className="sl-explore">Explore event →</span>
              </Link>
            </li>
          ))}
        </ol>
        <h3 className="sl-subhead">Also on the campus calendar</h3>
        <ul className="sl-traditions sl-traditions-grid">
          {campusEvents.map(([name, what]) => (
            <li key={name}>
              <strong>{name}</strong>
              <span>{what}</span>
            </li>
          ))}
        </ul>
        <p className="sl-note">
          On-campus traditions named in the{' '}
          <External href={brochure2015}>2015–16 Institute Brochure</External>.
        </p>
      </section>
    </>
  );
}
