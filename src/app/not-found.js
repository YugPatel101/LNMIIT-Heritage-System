import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="wrap empty not-found">
      <p className="eyebrow">404 / A PATH LESS TRAVELLED</p>
      <h1>This page isn’t here.</h1>
      <p>Continue exploring the LNMIIT collection from the homepage.</p>
      <Link className="button" href="/">
        Return home ↗
      </Link>
    </section>
  );
}
