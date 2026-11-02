'use client';
import { useEffect, useRef, useState } from 'react';
const chapters = [
  {
    year: '2002',
    title: 'An idea takes root.',
    text: 'A shared vision of the Government of Rajasthan and the Lakshmi & Usha Mittal Foundation. The beginning of LNMIIT.',
    image: '/media/centralplaza.jpg',
    alt: 'The central plaza at LNMIIT at sunset',
    label: 'The founding vision',
  },
  {
    year: '2003–04',
    title: 'The journey begins.',
    text: 'The first academic session opens. A vision becomes a place to learn, question and grow.',
    image: '/media/lnmiit2.jpg',
    alt: 'An aerial view of the LNMIIT campus',
    label: 'Academic life begins',
  },
  {
    year: '2006',
    title: 'A new chapter.',
    text: 'LNMIIT becomes a deemed-to-be university under the UGC.',
    image: '/media/centralplaza.jpg',
    alt: 'LNMIIT’s curved red sandstone colonnade',
    label: 'University status',
  },
  {
    year: '2023',
    title: 'A legacy, moving forward.',
    text: 'NAAC reaccredits LNMIIT with an A grade. The journey of learning continues.',
    image: '/media/lnmiit2.jpg',
    alt: 'Academic buildings and green spaces on the LNMIIT campus',
    label: 'The journey continues',
  },
];
export default function ParallaxTimeline() {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [short, setShort] = useState(false);
  const staticMode = reduced || paused || short;
  useEffect(() => {
    setReady(true);
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const small = matchMedia('(max-height: 650px)');
    const sync = () => {
      setReduced(motion.matches);
      setShort(small.matches);
    };
    sync();
    motion.addEventListener('change', sync);
    small.addEventListener('change', sync);
    return () => {
      motion.removeEventListener('change', sync);
      small.removeEventListener('change', sync);
    };
  }, []);
  useEffect(() => {
    if (!ready || staticMode) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = root.current;
      const header = window.innerWidth <= 700 ? 68 : 80;
      const r = el.getBoundingClientRect();
      const travel = el.offsetHeight - (window.innerHeight - header);
      const p = Math.min(
        1,
        Math.max(0, (header - r.top) / Math.max(1, travel)),
      );
      const index = Math.min(3, Math.floor(p * 4));
      setActive(index);
      const local = p * 4 - index;
      el.style.setProperty('--chapter-shift', `${(local - 0.5) * 64}px`);
      el.style.setProperty('--year-shift', `${(local - 0.5) * -44}px`);
      el.style.setProperty('--story-progress', String(p));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', request);
      removeEventListener('resize', request);
    };
  }, [ready, staticMode]);
  function go(i) {
    const el = root.current;
    if (staticMode) {
      document.getElementById('chapter-' + i)?.scrollIntoView({
        behavior: reduced ? 'instant' : 'smooth',
        block: 'start',
      });
      return;
    }
    const h = innerWidth <= 700 ? 68 : 80;
    const start = el.getBoundingClientRect().top + scrollY - h;
    const travel = el.offsetHeight - (innerHeight - h);
    scrollTo({ top: start + travel * ((i + 0.12) / 4), behavior: 'smooth' });
  }
  return (
    <section
      id="heritage"
      ref={root}
      className={
        'story-scroll ' + (ready && !staticMode ? 'is-pinned' : 'is-static')
      }
      aria-label="LNMIIT heritage timeline"
    >
      <div className="story-stage">
        <div className="story-top">
          <span>
            OUR STORY <b>/ FOUR CHAPTERS</b>
          </span>
          <div>
            <button onClick={() => setPaused(!paused)} aria-pressed={paused}>
              {paused ? 'Enable parallax' : 'Read without motion'}
            </button>
            <a href="#discover">Skip timeline ↓</a>
          </div>
        </div>
        <div className="story-scenes">
          {chapters.map((c, i) => (
            <article
              id={'chapter-' + i}
              key={c.year}
              className={'story-scene ' + (i === active ? 'is-active' : '')}
              aria-hidden={
                !staticMode && ready && i !== active ? true : undefined
              }
            >
              <div className="story-copy">
                <span className="story-year" aria-hidden="true">
                  {c.year}
                </span>
                <div className="story-words">
                  <p className="story-kicker">
                    {c.year} <span>— {c.label}</span>
                  </p>
                  <h2>{c.title}</h2>
                  <p>{c.text}</p>
                  <a
                    href="https://lnmiit.ac.in/about/"
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={!staticMode && ready && i !== active ? -1 : 0}
                  >
                    Official history ↗
                  </a>
                </div>
              </div>
              <figure className={'story-figure position-' + i}>
                <div className="story-image-window">
                  <img src={c.image} alt={c.alt} loading="eager" />
                </div>
                <figcaption>
                  CAMPUS TODAY <span>•</span> A STORY FROM {c.year}
                </figcaption>
              </figure>
            </article>
          ))}
        </div>
        <div className="story-bottom">
          <nav className="year-nav" aria-label="Jump to a heritage milestone">
            <div className="year-track">
              <span />
            </div>
            {chapters.map((c, i) => (
              <button
                key={c.year}
                onClick={() => go(i)}
                aria-label={`Go to ${c.year}: ${c.title}`}
                aria-current={!staticMode && i === active ? 'step' : undefined}
              >
                <span className="year-dot" />
                <span>{c.year}</span>
              </button>
            ))}
          </nav>
          <div className="story-footer">
            <span>{String(active + 1).padStart(2, '0')} / 04</span>
            <span>
              SCROLL TO CONTINUE <b>↓</b>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
