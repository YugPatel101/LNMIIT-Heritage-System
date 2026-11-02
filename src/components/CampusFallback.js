'use client';
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  createCampus,
  projectFaces,
  projectPoint,
  landmarks,
  FALLBACK_ZOOM,
} from '@/data/campus-model.mjs';
const HOME = { angle: 0, tilt: 35, zoom: FALLBACK_ZOOM, panX: 0, panY: 0 };
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
export default forwardRef(function CampusFallback(
  {
    selected,
    category,
    labels,
    routeLayers,
    panMode,
    onSelect,
    onPreset,
    simplified,
  },
  ref,
) {
  const [view, setView] = useState(HOME);
  const geometry = useMemo(() => createCampus(), []),
    faces = useMemo(() => projectFaces(geometry, view), [geometry, view]),
    drag = useRef(null);
  useImperativeHandle(ref, () => ({
    preset(name) {
      onPreset?.(name);
      setView(
        name === 'top'
          ? { ...HOME, tilt: 0 }
          : name === 'academic'
            ? { ...HOME, tilt: 55, zoom: 1.1, panY: 300 }
            : name === 'sports'
              ? { ...HOME, tilt: 55, zoom: 0.8, panY: -190 }
              : HOME,
      );
    },
    zoom(factor) {
      setView((v) => ({ ...v, zoom: clamp(v.zoom / factor, 0.25, 3) }));
    },
    rotate(deg) {
      setView((v) => ({ ...v, angle: v.angle + deg }));
    },
  }));
  function down(e) {
    if (e.button !== 0) return;
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      view,
      pan: panMode || e.shiftKey,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x,
      dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    if (d.moved)
      setView(
        d.pan
          ? { ...d.view, panX: d.view.panX + dx, panY: d.view.panY + dy }
          : {
              ...d.view,
              angle: d.view.angle + dx * 0.25,
              tilt: clamp(d.view.tilt + dy * 0.2, 0, 75),
            },
      );
  }
  function up(e) {
    if (drag.current && !drag.current.moved) {
      const id = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest('[data-landmark]')
        ?.getAttribute('data-landmark');
      if (id) onSelect(id);
    }
    drag.current = null;
  }
  return (
    <>
      <svg
        className="cm-fallback-model"
        viewBox="0 0 1000 720"
        role="group"
        aria-label="Simplified campus view"
        tabIndex={0}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onKeyDown={(e) => {
          if (['+', '-', 'ArrowLeft', 'ArrowRight', '0'].includes(e.key)) {
            e.preventDefault();
            setView((v) =>
              e.key === '0'
                ? HOME
                : {
                    ...v,
                    zoom: clamp(
                      v.zoom +
                        (e.key === '+' ? 0.06 : e.key === '-' ? -0.06 : 0),
                      0.25,
                      3,
                    ),
                    angle:
                      v.angle +
                      (e.key === 'ArrowLeft'
                        ? -10
                        : e.key === 'ArrowRight'
                          ? 10
                          : 0),
                  },
            );
          }
        }}
      >
        {faces
          .filter((f) => !f.route || routeLayers[f.route])
          .map((f) => {
            const l = landmarks.find((l) => l.id === f.id);
            return (
              <polygon
                key={f.key}
                data-landmark={f.id || undefined}
                points={f.screen
                  .map((p) => p.map((n) => n.toFixed(1)).join(','))
                  .join(' ')}
                fill={
                  l && category !== 'all' && l.category !== category
                    ? '#b9b8a7'
                    : f.color
                }
                stroke={selected === f.id ? '#78593e' : f.color}
                strokeWidth=".3"
              />
            );
          })}
        {labels &&
          landmarks
            .filter((l) => category === 'all' || l.category === category)
            .map((l) => {
              const p = projectPoint([l.x, l.y + 10, l.z], view);
              return (
                <g
                  key={l.id}
                  data-landmark={l.id}
                  transform={`translate(${p[0]},${p[1]})`}
                >
                  <circle
                    r="12"
                    fill={selected === l.id ? '#733c36' : '#fff'}
                  />
                  <text
                    textAnchor="middle"
                    y="4"
                    fontSize="10"
                    fill={selected === l.id ? 'white' : '#394736'}
                  >
                    {landmarks.indexOf(l) + 1}
                  </text>
                </g>
              );
            })}
      </svg>
      <p className="cm-fallback-note">
        {simplified
          ? 'Simplified view · detailed rendering switched off'
          : 'Simplified view · 3D graphics unavailable in this browser'}
      </p>
    </>
  );
});
