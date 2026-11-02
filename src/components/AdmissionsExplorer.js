'use client';
import { useState } from 'react';
import { admissions, official } from '@/data/content';
export default function AdmissionsExplorer() {
  const [selected, setSelected] = useState('ug');
  const a = admissions.find((a) => a.id === selected);
  return (
    <>
      <div
        className="admission-tabs"
        role="tablist"
        aria-label="Programme level"
      >
        {admissions.map((x, i) => (
          <button
            key={x.id}
            id={'tab-' + x.id}
            role="tab"
            aria-selected={selected === x.id}
            aria-controls="admissions-panel"
            tabIndex={selected === x.id ? 0 : -1}
            onClick={() => setSelected(x.id)}
            onKeyDown={(e) => {
              let n;
              if (e.key === 'ArrowRight') n = (i + 1) % 3;
              else if (e.key === 'ArrowLeft') n = (i + 2) % 3;
              else if (e.key === 'Home') n = 0;
              else if (e.key === 'End') n = 2;
              if (n !== undefined) {
                e.preventDefault();
                setSelected(admissions[n].id);
                document.getElementById('tab-' + admissions[n].id).focus();
              }
            }}
          >
            <span>0{i + 1}</span>
            {x.label}
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div
        id="admissions-panel"
        role="tabpanel"
        aria-labelledby={'tab-' + a.id}
        tabIndex={0}
        className="admissions-panel"
      >
        <div>
          <p className="eyebrow">{a.eyebrow}</p>
          <h2>{a.title}</h2>
          <p>{a.description}</p>
          <a
            className="button"
            href={official + a.url}
            target="_blank"
            rel="noreferrer"
          >
            Official {a.label.toLowerCase()} admissions ↗
          </a>
          <a className="admission-email" href={'mailto:' + a.email}>
            {a.email}
          </a>
          {a.id === 'pg' && (
            <div className="pg-links">
              <a
                href={official + '/admissions/pg-science/'}
                target="_blank"
                rel="noreferrer"
              >
                M.Sc. admissions ↗
              </a>
              <a
                href={official + '/admissions/ms-by-research/'}
                target="_blank"
                rel="noreferrer"
              >
                M.S. by Research admissions ↗
              </a>
            </div>
          )}
        </div>
        <div>
          <h3>Explore the programmes</h3>
          <ul className="lined-list">
            {a.programs.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <h3>Admission routes</h3>
          <div className="topic-list">
            {a.modes.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
