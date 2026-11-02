import { Intro, Breadcrumb, Source } from '@/components/UI';
import { milestones } from '@/data/content';
export const metadata = { title: 'Our heritage' };
export default function Heritage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Heritage' }]} />
      <Intro
        number="01"
        title={
          <>
            Every legacy begins
            <br />
            <em>with an idea.</em>
          </>
        }
        description="Explore the foundations, values and documented milestones of The LNM Institute of Information Technology."
      />
      <section className="wrap heritage-photo">
        <img
          src="/media/centralplaza.jpg"
          alt="The red sandstone architecture of the LNMIIT central plaza"
        />
        <span>THE CAMPUS COLLECTION / CENTRAL PLAZA</span>
      </section>
      <section className="wrap section foundation">
        <div>
          <p className="eyebrow">THE FOUNDING STORY</p>
          <h2>
            A partnership
            <br />
            for possibility.
          </h2>
        </div>
        <div>
          <p className="lead">
            LNMIIT was established in 2002 through a partnership between the
            Government of Rajasthan and the Lakshmi & Usha Mittal Foundation.
          </p>
          <p>
            The foundation is associated with industrialist Lakshmi N. Mittal.
            Academic operations began in 2003–04, setting in motion the
            institute’s journey in higher education.
          </p>
          <Source href="/about/" label="Foundation & institutional history" />
        </div>
      </section>
      <section className="values">
        <div className="wrap values-grid">
          <div>
            <p className="eyebrow">01 / THE VISION</p>
            <h2>
              Knowledge that
              <br />
              <em>reaches beyond.</em>
            </h2>
            <p>
              Build knowledge through research and technology-enabled learning,
              and contribute to society through connections with industry and
              academic institutions.
            </p>
          </div>
          <div>
            <p className="eyebrow">02 / THE MISSION</p>
            <h2>Learning with purpose.</h2>
            <ul>
              <li>Strong academic fundamentals and emerging areas of study.</li>
              <li>Innovation, research and intellectual property.</li>
              <li>
                Integrity, teamwork, ethics and environmental responsibility.
              </li>
              <li>Leadership, entrepreneurship and lifelong learning.</li>
            </ul>
            <Source href="/about/" label="Read the full vision & mission" />
          </div>
        </div>
      </section>
      <section className="wrap section timeline-layout">
        <div className="timeline-heading">
          <p className="eyebrow">MOMENTS THAT SHAPED US</p>
          <h2>
            The journey,
            <br />
            <em>over time.</em>
          </h2>
          <p>A selection of milestones documented by LNMIIT.</p>
          <a className="text-link" href="#timeline">
            Follow the timeline ↓
          </a>
        </div>
        <ol className="timeline" id="timeline">
          {milestones.map((m) => (
            <li key={m.year}>
              <span className="timeline-year">{m.year}</span>
              <div>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
                <Source href={m.url} label="Milestone source" />
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="wrap archive-note">
        <span className="eyebrow">KEEP EXPLORING</span>
        <h2>Heritage lives in the spaces we share.</h2>
        <p>
          Step into the campus photograph collection and discover LNMIIT’s
          residential and academic setting.
        </p>
        <a className="button" href="/gallery/">
          Open the campus collection ↗
        </a>
      </section>
    </>
  );
}
