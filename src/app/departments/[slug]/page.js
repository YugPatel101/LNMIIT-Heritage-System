import Link from 'next/link';
import { notFound } from 'next/navigation';
import { departments, official } from '@/data/content';
import { Breadcrumb, Source } from '@/components/UI';
export function generateStaticParams() {
  return departments.map((d) => ({ slug: d.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = departments.find((d) => d.slug === slug);
  return { title: d?.name || 'Department' };
}
export default async function Department({ params }) {
  const { slug } = await params;
  const d = departments.find((d) => d.slug === slug);
  if (!d) notFound();
  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Departments', href: '/departments/' },
          { label: d.code },
        ]}
      />
      <section className="detail-hero wrap">
        <div>
          <p className="eyebrow">ACADEMIC EXPLORER / {d.group}</p>
          <h1>{d.name}</h1>
          <p>{d.summary}</p>
          <Source href={d.source} label="Visit official department website" />
        </div>
        <div className="department-emblem" aria-hidden="true">
          <span>LNMIIT / ACADEMICS</span>
          <strong>{d.code}</strong>
          <span>KNOWLEDGE · DISCOVERY · POSSIBILITY</span>
        </div>
      </section>
      <div className="wrap detail-layout section compact">
        <div>
          <section className="detail-section">
            <p className="eyebrow">01 / INTRODUCTION</p>
            <h2>Inside the department</h2>
            <p>{d.overview}</p>
            <Source href={d.extra} />
          </section>
          <section className="detail-section">
            <p className="eyebrow">02 / AREAS TO EXPLORE</p>
            <h2>Where curiosity leads</h2>
            <div className="topic-list">
              {d.topics.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <Source href={d.extra} label="Explore the official overview" />
          </section>
          {d.labs.length > 0 && (
            <section className="detail-section">
              <p className="eyebrow">03 / PRACTICAL LEARNING</p>
              <h2>Laboratories & facilities</h2>
              <ul className="lined-list">
                {d.labs.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <Source href={d.facilities} label="Explore official facilities" />
            </section>
          )}
        </div>
        <aside>
          <div className="aside-card">
            <p className="eyebrow">YOUR ACADEMIC PATH</p>
            <h2>Programmes</h2>
            <ul className="lined-list">
              {d.programs.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <Source
              href={d.programSource}
              label="Programme details & curriculum"
            />
            <Link className="button" href="/admissions/">
              Explore admissions ↗
            </Link>
          </div>
          <div className="aside-links">
            <h3>People behind the ideas</h3>
            <p>
              Meet the faculty and explore their current profiles on the
              official website.
            </p>
            <Source href={d.source + 'people/'} label="Faculty directory" />
          </div>
        </aside>
      </div>
      <section className="wrap next-section">
        <Link href="/departments/" className="text-link">
          ← Back to all departments
        </Link>
        <Link href="/heritage/" className="text-link">
          Discover our heritage ↗
        </Link>
      </section>
    </>
  );
}
