'use client';
import { useEffect, useRef } from 'react';
import { motto } from '@/data/content';
export default function CampusHero() {
  const root = useRef(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    function update() {
      frame = 0;
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0) return;
      const offset = media.matches ? 0 : Math.max(0, -r.top);
      el.style.setProperty('--hero-travel', `${offset * 0.2}px`);
    }
    function request() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    addEventListener('scroll', request, { passive: true });
    media.addEventListener('change', request);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', request);
      media.removeEventListener('change', request);
    };
  }, []);
  return (
    <section className="campus-hero" ref={root}>
      <div className="campus-backdrop">
        <img
          src="/media/official/film-plaza-aerial.webp"
          alt="Overhead view of LNMIIT’s central plaza, curved colonnade and solar-roofed academic blocks among trees"
          fetchPriority="high"
        />
      </div>
      <div className="campus-shade" />
      <div className="campus-hero-copy">
        <p>THE LNM INSTITUTE OF INFORMATION TECHNOLOGY</p>
        <h1>
          {motto[0]}
          <br />
          {motto[1]}
        </h1>
        <p className="campus-subtitle">
          Creating knowledge through quality research and technology-enabled
          teaching, on a green campus in Jaipur since 2002.
        </p>
        <a className="v2-button" href="#heritage">
          Explore LNMIIT <span>↗</span>
        </a>
      </div>
      <div className="hero-bottom">
        <span>
          JAIPUR, RAJASTHAN <i> / </i> EST. 2002
        </span>
        <a href="#heritage">
          SCROLL TO DISCOVER <b>↓</b>
        </a>
      </div>
    </section>
  );
}
