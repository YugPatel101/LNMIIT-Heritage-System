'use client';
import { useState } from 'react';
import { departments, officialUrl } from '@/data/content';
export default function DepartmentExplorer() {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('All departments');
  const filtered = departments.filter(
    (d) =>
      (group === 'All departments' || d.group === group) &&
      (d.name + ' ' + d.code + ' ' + d.topics.join(' '))
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  return (
    <>
      <div className="explorer-toolbar">
        <div className="pills" aria-label="Filter departments">
          {['All departments', 'Engineering', 'Sciences & Humanities'].map(
            (g) => (
              <button
                aria-pressed={group === g}
                onClick={() => setGroup(g)}
                key={g}
              >
                {g}
              </button>
            ),
          )}
        </div>
        <label className="search">
          <span className="sr-only">Search departments</span>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search by name or interest…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </div>
      <p className="result-count" role="status">
        {filtered.length} {filtered.length === 1 ? 'department' : 'departments'}{' '}
        to explore
      </p>
      <div className="department-grid">
        {filtered.map((d) => (
          <a
            className="department-card"
            key={d.slug}
            href={officialUrl(d.source)}
            target="_blank"
            rel="noreferrer"
            aria-label={`${d.name}: official LNMIIT department page, opens in a new tab`}
          >
            <div className="department-top">
              <span>{d.code}</span>
              <span aria-hidden="true">↗</span>
            </div>
            <p className="eyebrow">{d.group}</p>
            <h2>{d.name}</h2>
            <p>{d.summary}</p>
            <span className="card-bottom">
              Official department page <span aria-hidden="true">↗</span>
            </span>
          </a>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty">
          <h2>No departments found</h2>
          <p>Try a broader subject, such as computing, physics or economics.</p>
          <button
            className="button"
            onClick={() => {
              setQ('');
              setGroup('All departments');
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
