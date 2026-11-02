'use client';
import { useState } from 'react';
import { clubs, councils, gymkhanaSite } from '@/data/student-life';
const ALL = 'all';
export default function ClubExplorer() {
  const [council, setCouncil] = useState(ALL);
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const councilOf = (club) => councils.find((c) => c.id === club.council);
  const filtered = clubs.filter(
    (c) =>
      (council === ALL || c.council === council) &&
      `${c.name} ${councilOf(c).name} ${c.focus} ${c.tags ?? ''}`
        .toLowerCase()
        .includes(q),
  );
  return (
    <>
      <div className="explorer-toolbar">
        <div className="pills" aria-label="Filter clubs by council">
          {[{ id: ALL, name: 'All clubs' }, ...councils].map((c) => (
            <button
              key={c.id}
              aria-pressed={council === c.id}
              onClick={() => setCouncil(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">Search clubs</span>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search by name or interest…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <p className="result-count" role="status">
        {filtered.length} {filtered.length === 1 ? 'club' : 'clubs'} to explore
      </p>
      <div className="sl-club-grid">
        {filtered.map((c) => (
          <a
            key={c.id}
            className="sl-club"
            href={`${gymkhanaSite}/clubs/${c.id}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`${c.name}: official Student Gymkhana page, opens in a new tab`}
          >
            <span className="eyebrow">{councilOf(c).name}</span>
            <h3>{c.name}</h3>
            <p>{c.focus}</p>
            <small>
              {c.mentor ? `Faculty mentor: ${c.mentor}` : 'Official club page'}
              <span aria-hidden="true"> ↗</span>
            </small>
          </a>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty">
          <h3>No clubs found</h3>
          <p>Try a broader interest, such as music, coding or football.</p>
          <button
            className="button"
            onClick={() => {
              setQuery('');
              setCouncil(ALL);
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
