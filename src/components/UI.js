import Link from 'next/link';
import { official } from '@/data/content';
export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
export function Source({ href = '/about/', label = 'Official LNMIIT source' }) {
  return (
    <a
      className="source"
      href={href.startsWith('http') ? href : official + href}
      target="_blank"
      rel="noreferrer"
    >
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}
export function Intro({ number, title, description }) {
  return (
    <section className="page-intro wrap">
      <div className="eyebrow">
        THE LNMIIT COLLECTION <span>/ {number}</span>
      </div>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
export function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb wrap" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((x, i) => (
        <span key={i}>
          {' '}
          /{' '}
          {x.href ? (
            <Link href={x.href}>{x.label}</Link>
          ) : (
            <span aria-current="page">{x.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function SectionHead({ eyebrow, title, href, label }) {
  return (
    <div className="section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {label} <Arrow />
        </Link>
      )}
    </div>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <Link
            href="/"
            className="footer-brand"
            aria-label="LNMIIT Heritage home"
          >
            <strong>LNMIIT</strong>
            <span>HERITAGE</span>
          </Link>
          <p>
            A place to discover.
            <br />A legacy to explore.
          </p>
          <span className="eyebrow">JAIPUR, RAJASTHAN · EST. 2002</span>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/heritage/">Our heritage</Link>
          <Link href="/departments/">Departments</Link>
          <Link href="/student-life/">Student life</Link>
          <Link href="/gallery/">Campus gallery</Link>
          <Link href="/campus-map/">3D campus map</Link>
          <Link href="/admissions/">Admissions explorer</Link>
        </div>
        <div>
          <h3>Visit & connect</h3>
          <p>
            Rupa ki Nangal, Post-Sumel,
            <br />
            Via-Jamdoli, Jaipur 302031,
            <br />
            Rajasthan, India
          </p>
          <Source href="/" label="Visit lnmiit.ac.in" />
        </div>
      </div>
      <div className="wrap footer-bottom">
        <p>
          Student mini project by Yug Patel & Parth Vadalia · Guided by Dr
          Saurabh Kumar.
          <br />
          An educational heritage portal; applications are handled by LNMIIT’s
          official admissions portal.
        </p>
        <Link href="/sources/">
          Sources & credits <Arrow />
        </Link>
      </div>
    </footer>
  );
}
