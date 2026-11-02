import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/UI';
import { majorEvents } from '@/data/student-life';
export const dynamicParams = false;
export function generateStaticParams() {
  return majorEvents.map((e) => ({ slug: e.id }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = majorEvents.find((e) => e.id === slug);
  return event ? { title: event.name, description: event.summary } : {};
}
function EventLink({ href, children }) {
  if (href.startsWith('mailto:')) {
    return <a href={href}>{children}</a>;
  }
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}
function ProgramGroup({ group }) {
  return (
    <>
      <h2 className="sl-event-subhead">{group.title}</h2>
      <ul className="sl-program">
        {group.items.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
export default async function EventPage({ params }) {
  const { slug } = await params;
  const index = majorEvents.findIndex((e) => e.id === slug);
  if (index < 0) {
    notFound();
  }
  const event = majorEvents[index];
  const next = majorEvents[(index + 1) % majorEvents.length];
  const [main, ...more] = event.groups;
  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Student life', href: '/student-life/' },
          { label: 'Major events', href: '/student-life/#major-events' },
          { label: event.name },
        ]}
      />
      <section className="sl-event-hero wrap">
        <div>
          <p className="eyebrow">{event.kind}</p>
          <h1>{event.name}</h1>
          <small>{event.edition}</small>
          <p className="sl-lead">{event.summary}</p>
        </div>
        <img src={event.image} alt={event.alt} />
      </section>
      <section className={event.flagship ? 'sl-esummit' : 'sl-event-body'}>
        <div className="wrap">
          <h2 className="sl-event-subhead">About {event.name}</h2>
          <div className="sl-event-about">
            {event.about.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          {event.stats && (
            <>
              <div className="sl-stats">
                {event.stats.map(([value, label]) => (
                  <div key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <p className="sl-note">{event.statsNote}</p>
            </>
          )}
          <ProgramGroup group={main} />
          <h2 className="sl-event-subhead">Edition by edition</h2>
          <ol className="sl-editions">
            {event.editions.map((e) => (
              <li key={e.year}>
                <b>{e.year}</b>
                <div>
                  <strong>{e.title}</strong>
                  <small>{e.status}</small>
                  <p>{e.text}</p>
                </div>
              </li>
            ))}
          </ol>
          {event.note && <p className="sl-note">{event.note}</p>}
          {more.map((group) => (
            <ProgramGroup key={group.title} group={group} />
          ))}
          {event.gallery && (
            <div className="sl-event-gallery">
              {event.gallery.map((g) => (
                <figure key={g.src}>
                  <img src={g.src} alt={g.alt} loading="lazy" />
                  <figcaption>{g.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}
          <p className="sl-note">{event.credit}</p>
          <div className="sl-links">
            {event.links.map((l) => (
              <EventLink key={l.href} href={l.href}>
                {l.label}
              </EventLink>
            ))}
          </div>
        </div>
      </section>
      <nav className="sl-event-nav wrap" aria-label="Major events">
        <Link href="/student-life/#major-events">← All major events</Link>
        <Link href={`/student-life/events/${next.id}/`}>
          Next event: {next.name} →
        </Link>
      </nav>
    </>
  );
}
