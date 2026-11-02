'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
const links = [
  ['Discover', '/#discover'],
  ['Heritage', '/heritage/'],
  ['Academics', '/departments/'],
  ['Campus', '/gallery/'],
  ['Student Life', '/student-life/'],
];
function MapPin() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s7-7.2 7-12.5a7 7 0 1 0-14 0C5 14.8 12 22 12 22Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  );
}
export default function NavBar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef(null);
  const onMap = path.startsWith('/campus-map');
  const home =
    path === '/' ||
    path.startsWith('/prototype-horizontal') ||
    path.startsWith('/prototype-vertical');
  useEffect(() => {
    const update = () => setScrolled(scrollY > 40);
    update();
    addEventListener('scroll', update, { passive: true });
    return () => removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [path]);
  function closeOnEscape(e) {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      menu.current?.focus();
    }
  }
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <header
        onKeyDown={closeOnEscape}
        className={
          'v2-header ' + (home && !scrolled && !open ? 'over-hero' : 'solid')
        }
      >
        <div className="v2-nav">
          <Link href="/" className="v2-brand" aria-label="LNMIIT Heritage home">
            <strong>LNMIIT</strong>
            <span>HERITAGE</span>
          </Link>
          {/* Phones collapse the nav, so the map stays one tap away in the bar itself. */}
          <Link
            href="/campus-map/"
            className="nav-3d nav-3d-bar"
            aria-label="Explore 3D Campus"
            aria-current={onMap ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            <MapPin />
            3D Campus
          </Link>
          <button
            ref={menu}
            className="v2-menu"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="site-navigation"
          >
            {open ? 'Close ✕' : 'Menu ☰'}
          </button>
          <nav
            id="site-navigation"
            className={open ? 'open' : ''}
            aria-label="Main navigation"
          >
            {links.map(([label, href]) => {
              const target = home
                ? label === 'Heritage'
                  ? '#heritage'
                  : href.startsWith('/#')
                    ? href.slice(1)
                    : href
                : href;
              const current =
                !home &&
                !href.includes('#') &&
                path.startsWith(href.slice(0, -1));
              return (
                <Link
                  key={label}
                  href={target}
                  aria-current={current ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/campus-map/"
              className="nav-3d"
              aria-current={onMap ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              <MapPin />
              Explore 3D Campus
            </Link>
            <Link
              href="/admissions/"
              className="nav-apply"
              aria-current={path.startsWith('/admissions') ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              Admissions ↗
            </Link>
          </nav>
        </div>
      </header>
      {!home && <div className="nav-spacer" />}
    </>
  );
}
