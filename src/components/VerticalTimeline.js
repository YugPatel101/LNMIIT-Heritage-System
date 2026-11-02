'use client';
import { useEffect, useRef, useState } from 'react';
const milestones = [
  {
    year: '2002',
    label: 'THE FOUNDATION',
    title: 'An idea takes root.',
    text: 'A shared vision of the Government of Rajasthan and the Lakshmi & Usha Mittal Foundation. The beginning of LNMIIT.',
  },
  {
    year: '2003–04',
    label: 'THE FIRST ACADEMIC SESSION',
    title: 'The journey begins.',
    text: 'The first academic session opens. A vision becomes a place to learn, question and grow.',
  },
  {
    year: '2006',
    label: 'DEEMED-TO-BE UNIVERSITY',
    title: 'A new chapter.',
    text: 'LNMIIT becomes a deemed-to-be university under the UGC.',
  },
  {
    year: '2023',
    label: 'NAAC REACCREDITATION',
    title: 'A legacy, moving forward.',
    text: 'NAAC reaccredits LNMIIT with an A grade. The journey of learning continues.',
  },
];
export default function VerticalTimeline() {
  const root = useRef(null);
  const list = useRef(null);
  const [active, setActive] = useState(-1);
  const [noMotion, setNoMotion] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setSystemReduced(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      if (!root.current || !list.current) return;
      const r = root.current.getBoundingClientRect();
      const box = list.current.getBoundingClientRect();
      const points = [...list.current.querySelectorAll('.vertical-dot')].map(
        (dot) => {
          const b = dot.getBoundingClientRect();
          return b.top + b.height / 2;
        },
      );
      const focusLine = innerHeight * 0.48;
      const first = points[0];
      const last = points[points.length - 1];
      const fill = Math.min(
        1,
        Math.max(0, (focusLine - first) / Math.max(1, last - first)),
      );
      const next = points.reduce(
        (index, y, i) => (y <= focusLine ? i : index),
        -1,
      );
      setActive(next);
      list.current.style.setProperty('--line-start', `${first - box.top}px`);
      list.current.style.setProperty('--line-length', `${last - first}px`);
      list.current.style.setProperty('--vertical-progress', String(fill));
      const travel = Math.min(
        1,
        Math.max(0, (innerHeight - r.top) / (r.height + innerHeight)),
      );
      root.current.style.setProperty(
        '--quiet-drift',
        noMotion || systemReduced ? '0px' : `${(travel - 0.5) * 42}px`,
      );
    }
    function request() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request);
    const observer = new ResizeObserver(request);
    observer.observe(list.current);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', request);
      removeEventListener('resize', request);
      observer.disconnect();
    };
  }, [noMotion, systemReduced]);
  return (
    <section
      id="heritage"
      ref={root}
      className={
        'vertical-heritage ' +
        (noMotion || systemReduced ? 'without-drift' : '')
      }
      aria-labelledby="vertical-heritage-title"
    >
      <div className="vertical-top">
        <span>
          OUR STORY <b>/ ONE CONTINUOUS JOURNEY</b>
        </span>
        <div>
          <button
            aria-pressed={noMotion}
            onClick={() => setNoMotion(!noMotion)}
          >
            {noMotion ? 'Enable subtle motion' : 'Read without motion'}
          </button>
          <a href="#discover">Skip timeline ↓</a>
        </div>
      </div>
      <div className="vertical-layout">
        <aside className="vertical-intro">
          <p className="vertical-eyebrow">ROOTED IN A VISION</p>
          <h2 id="vertical-heritage-title">
            Built over time.
            <br />
            <em>
              Still moving
              <br />
              forward.
            </em>
          </h2>
          <p className="vertical-intro-copy">
            From the first idea to the next chapter.
            <br />
            Follow the milestones that shaped LNMIIT.
          </p>
          <figure className="vertical-campus">
            <div>
              <img
                src="/media/centralplaza.jpg"
                alt="The central plaza at LNMIIT, shown as a present-day campus view"
                loading="lazy"
              />
            </div>
            <figcaption>
              CAMPUS TODAY <span>•</span> A CONSTANT THROUGH THE STORY
            </figcaption>
          </figure>
          <a
            className="vertical-source"
            href="https://lnmiit.ac.in/about/"
            target="_blank"
            rel="noreferrer"
          >
            Explore the official history ↗
          </a>
        </aside>
        <ol className="vertical-milestones" ref={list}>
          <li className="vertical-track" aria-hidden="true" role="presentation">
            <span />
          </li>
          {milestones.map((m, i) => (
            <li
              key={m.year}
              id={'milestone-' + m.year}
              className={
                (active === i ? 'is-current ' : active > i ? 'is-past ' : '') +
                'vertical-milestone'
              }
              aria-current={active === i ? 'step' : undefined}
            >
              <span className="vertical-dot" aria-hidden="true" />
              <div className="vertical-milestone-content">
                <span className="vertical-year">{m.year}</span>
                <p className="vertical-label">{m.label}</p>
                <h3>{m.title}</h3>
                <p className="vertical-summary">{m.text}</p>
                <span className="vertical-number">
                  {String(i + 1).padStart(2, '0')} / 04
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="vertical-outro">
        <span>THE STORY CONTINUES</span>
        <a href="#discover">Discover the campus today ↓</a>
      </div>
    </section>
  );
}
