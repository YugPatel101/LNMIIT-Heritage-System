'use client';
import { useEffect, useRef, useState } from 'react';
import { landmarks, palette, categories } from '@/data/campus-model.mjs';
import { referenceImage, referencePins } from '@/data/campus-reference.mjs';
import CampusScene from './CampusScene';
const placeNumber = (l) => String(landmarks.indexOf(l) + 1).padStart(2, '0');
export default function CampusMap() {
  const [preset, setPreset] = useState('overview'),
    [selected, setSelected] = useState('plaza'),
    [category, setCategory] = useState('all'),
    [labels, setLabels] = useState(true),
    [query, setQuery] = useState(''),
    [reference, setReference] = useState(false),
    [pin, setPin] = useState(null);
  const [simplified, setSimplified] = useState(false);
  const [routeLayers, setRouteLayers] = useState({
      shared: true,
      walking: true,
    }),
    [panMode, setPanMode] = useState(false);
  const scene = useRef(null),
    refButton = useRef(null),
    dialog = useRef(null);
  const active = landmarks.find((x) => x.id === selected),
    visible = landmarks.filter(
      (x) =>
        (category === 'all' || x.category === category) &&
        x.name.toLowerCase().includes(query.toLowerCase()),
    );
  useEffect(() => {
    if (reference) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [reference]);

  function choose(id) {
    setSelected(id);
    setPreset('');
  }
  function showInModel(id) {
    setReference(false);
    setCategory('all');
    choose(id);
  }
  function filter(cat) {
    setCategory(cat);
    const first = landmarks.find((x) => cat === 'all' || x.category === cat);
    if (cat !== 'all' && active?.category !== cat) setSelected(first.id);
  }
  return (
    <>
      <section className="cm-intro wrap">
        <div>
          <p className="eyebrow">THE CAMPUS / IN THREE DIMENSIONS</p>
          <h1>Find your place.</h1>
          <p>Room to explore. A campus that stretches beyond the screen.</p>
        </div>
        <button
          className="cm-reference-button"
          ref={refButton}
          onClick={() => setReference(true)}
        >
          View campus guide <span aria-hidden="true">↗</span>
        </button>
      </section>
      <section className="cm-explorer" aria-label="Interactive campus model">
        <div className="cm-topbar">
          <div className="cm-tabs" aria-label="Filter campus places">
            {categories.map(([id, title]) => (
              <button
                key={id}
                aria-pressed={category === id}
                onClick={() => filter(id)}
              >
                {title}
              </button>
            ))}
          </div>
          <span className="cm-status">
            <i /> Satellite-aligned 3D · v4
          </span>
        </div>
        <div className="cm-layout">
          <div className="cm-stage">
            <div className="cm-stage-title">
              <span>LNMIIT</span>
              <p>JAIPUR · CAMPUS EXPLORER</p>
            </div>
            <div className="cm-view-toggle" aria-label="Camera viewpoints">
              {[
                ['overview', 'Overview'],
                ['academic', 'Academic'],
                ['sports', 'Sports'],
                ['top', 'Top'],
              ].map(([id, title]) => (
                <button
                  key={id}
                  aria-pressed={preset === id}
                  onClick={() => scene.current?.preset(id)}
                >
                  {title}
                </button>
              ))}
            </div>
            <CampusScene
              key={simplified ? 'simple' : 'detailed'}
              simplified={simplified}
              ref={scene}
              selected={selected}
              category={category}
              labels={labels}
              routeLayers={routeLayers}
              panMode={panMode}
              onSelect={choose}
              onPreset={setPreset}
            />
            <div className="cm-controls" aria-label="Map controls">
              <button
                aria-label="Zoom in"
                onClick={() => scene.current?.zoom(0.8)}
              >
                +
              </button>
              <button
                aria-label="Zoom out"
                onClick={() => scene.current?.zoom(1.25)}
              >
                −
              </button>
              <span />
              <button
                aria-label="Rotate left"
                onClick={() => scene.current?.rotate(-20)}
              >
                ↶
              </button>
              <button
                aria-label="Rotate right"
                onClick={() => scene.current?.rotate(20)}
              >
                ↷
              </button>
              <span />
              <button
                aria-label="Reset view"
                onClick={() => scene.current?.preset('overview')}
              >
                ⌂
              </button>
            </div>
            <button
              className="cm-render-toggle"
              aria-pressed={simplified}
              onClick={() => setSimplified((v) => !v)}
            >
              {simplified ? 'Try detailed 3D' : 'Simplified view'}
            </button>
            <button
              className="cm-pan-toggle"
              aria-pressed={panMode}
              onClick={() => setPanMode(!panMode)}
            >
              {panMode ? 'Pan mode' : 'Orbit mode'} ↔
            </button>
            <button
              className="cm-label-toggle"
              aria-pressed={labels}
              onClick={() => setLabels(!labels)}
            >
              {labels ? 'Hide' : 'Show'} markers
            </button>
            <p className="cm-instructions" id="cm-instructions">
              Drag to {panMode ? 'pan' : 'orbit'} · Scroll or pinch to zoom
              <br />
              <span>
                Right / two-finger drag to pan · Arrows orbit · 0 reset
              </span>
            </p>
            <span className="cm-scale-note">
              Footprints from satellite imagery
              <br />
              Heights estimated from floors
            </span>
          </div>
          <aside className="cm-sidebar" aria-label="Campus places">
            <div className="cm-search">
              <label htmlFor="cm-search">Explore the campus</label>
              <div>
                <span aria-hidden="true">⌕</span>
                <input
                  id="cm-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find a place…"
                  type="search"
                />
              </div>
            </div>
            <div className="cm-place-list">
              {visible.map((l) => (
                <button
                  key={l.id}
                  className={selected === l.id ? 'active' : ''}
                  onClick={() => choose(l.id)}
                  aria-pressed={selected === l.id}
                >
                  <span className="cm-number">{placeNumber(l)}</span>
                  <span>
                    <strong>{l.name}</strong>
                    <small>{l.short}</small>
                  </span>
                  <span
                    className="cm-dot"
                    style={{ background: palette[l.category] }}
                  />
                </button>
              ))}
              {!visible.length && (
                <p className="cm-empty">
                  No places found. Try another name or choose “All places”.
                </p>
              )}
            </div>
            <div className="cm-detail" aria-live="polite">
              <span className="eyebrow">
                {active.category} / SELECTED PLACE
              </span>
              <h2>{active.name}</h2>
              <p>{active.description}</p>
              <small>{active.accuracy}</small>
            </div>
          </aside>
        </div>
        <div className="cm-legend">
          <div className="cm-category-legend">
            {categories
              .filter(([id]) => id !== 'all')
              .map(([id, title]) => (
                <span key={id}>
                  <i style={{ background: palette[id] }} />
                  {title}
                </span>
              ))}
          </div>
          <div className="cm-route-layers" aria-label="Route layers">
            {[
              ['shared', 'Shared roads'],
              ['walking', 'Walking paths'],
            ].map(([id, title]) => (
              <button
                key={id}
                aria-pressed={routeLayers[id]}
                onClick={() => setRouteLayers((v) => ({ ...v, [id]: !v[id] }))}
              >
                <i className={id} />
                {title}
                <span>{routeLayers[id] ? 'On' : 'Off'}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="cm-notes wrap">
        <div>
          <p className="eyebrow">BUILT FROM REAL MAP DATA</p>
          <h2>
            A familiar campus.
            <br />
            <span>A new perspective.</span>
          </h2>
        </div>
        <div>
          <p>
            Every building stands on its real footprint, traced from satellite
            imagery, and its roof is the actual satellite photograph of that
            roof. Walls follow the campus drone film and photographs, trees
            stand where imagery shows real canopy, and the distant hills use
            real elevation data. Choose any place to fly to it.
          </p>
          <p>
            Grey ribbons are roads and sandy lines are walking paths, both from
            OpenStreetMap. Heights are estimated from floor counts, walls are
            representative rather than photographed, and individual tree shapes
            are illustrative. This is an explorable campus model, not a measured
            survey or a navigation map.
          </p>
          <a href="/sources/">Model sources & credits ↗</a>
        </div>
      </section>
      <dialog
        className="cm-dialog"
        ref={dialog}
        onCancel={() => setReference(false)}
        onClose={() => {
          setReference(false);
          refButton.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setReference(false);
        }}
      >
        <div>
          <button
            className="cm-dialog-close"
            autoFocus
            onClick={() => setReference(false)}
            aria-label="Close campus guide"
          >
            Close ✕
          </button>
          <h2>The campus guide.</h2>
          <p>
            Every place in the explorer, numbered as in the 3D model. Choose a
            pin or a name to see that place in 3D.
          </p>
          <div className="cm-reference-frame">
            <div className="cm-reference">
              <img
                src={referenceImage.src}
                width={referenceImage.width}
                height={referenceImage.height}
                alt="Illustrated campus plan with numbered pins on each building and landmark"
              />
              {landmarks.map((l) => {
                const [x, y] = referencePins[l.id];
                return (
                  <button
                    key={l.id}
                    className={pin === l.id ? 'active' : ''}
                    style={{
                      left: `${(x / referenceImage.width) * 100}%`,
                      top: `${(y / referenceImage.height) * 100}%`,
                      background: palette[l.category],
                    }}
                    aria-label={`${placeNumber(l)} ${l.name}: show in 3D`}
                    onMouseEnter={() => setPin(l.id)}
                    onMouseLeave={() => setPin(null)}
                    onFocus={() => setPin(l.id)}
                    onBlur={() => setPin(null)}
                    onClick={() => showInModel(l.id)}
                  >
                    {placeNumber(l)}
                    <span>{l.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <small className="cm-reference-hint">
            Swipe the plan sideways to see the whole campus.
          </small>
          <div className="cm-reference-key">
            {categories
              .filter(([id]) => id !== 'all')
              .map(([id, title]) => {
                const places = landmarks.filter((l) => l.category === id);
                if (!places.length) return null;
                return (
                  <section key={id}>
                    <h3>
                      <i style={{ background: palette[id] }} />
                      {title}
                    </h3>
                    <ul>
                      {places.map((l) => (
                        <li key={l.id}>
                          <button
                            className={pin === l.id ? 'active' : ''}
                            onMouseEnter={() => setPin(l.id)}
                            onMouseLeave={() => setPin(null)}
                            onFocus={() => setPin(l.id)}
                            onBlur={() => setPin(null)}
                            onClick={() => showInModel(l.id)}
                          >
                            <b>{placeNumber(l)}</b> {l.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
          </div>
          <small>
            AI-generated illustration based on annotated campus screenshots, not
            a photograph or a survey. Pins mark where each place is drawn in
            this picture; exact positions are in the 3D model.
          </small>
        </div>
      </dialog>
    </>
  );
}
