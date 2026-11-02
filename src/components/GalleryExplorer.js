'use client';
import { useState, useRef, useEffect } from 'react';
import { photoCategories, photos } from '@/data/content';
export default function GalleryExplorer() {
  const [category, setCategory] = useState('All photographs');
  const [index, setIndex] = useState(null);
  const dialog = useRef(null);
  const opener = useRef(null);
  const filtered = photos.filter(
    (p) => category === 'All photographs' || p.category === category,
  );
  const photo = index === null ? null : filtered[index];
  useEffect(() => {
    if (index !== null) {
      if (!dialog.current.open) dialog.current.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.current?.close();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [index]);
  function close() {
    setIndex(null);
    opener.current?.focus();
  }
  function move(step) {
    setIndex((i) => (i + step + filtered.length) % filtered.length);
  }
  return (
    <>
      <div className="gallery-toolbar">
        <div className="pills" aria-label="Filter photographs">
          {['All photographs', ...photoCategories].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <span className="result-count" role="status">
          {filtered.length} photographs
        </span>
      </div>
      <div className="gallery-grid">
        {filtered.map((p, i) => (
          <button
            key={p.id}
            className="gallery-item"
            onClick={(e) => {
              opener.current = e.currentTarget;
              setIndex(i);
            }}
            aria-label={'Enlarge ' + p.title}
          >
            <div className={p.small ? 'photo-frame is-small' : 'photo-frame'}>
              <img src={p.src} alt={p.alt} loading="lazy" />
              <span className="enlarge" aria-hidden="true">
                ↗
              </span>
            </div>
            <div className="photo-caption">
              <div>
                <span className="eyebrow">{p.category}</span>
                <h2>{p.title}</h2>
              </div>
              <span className="index">{String(i + 1).padStart(2, '0')}</span>
            </div>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-labelledby="lightbox-title"
        onClose={() => opener.current?.focus()}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            move(1);
          }
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            move(-1);
          }
        }}
      >
        <button
          className="close-lightbox"
          onClick={close}
          aria-label="Close photograph"
        >
          ✕
        </button>
        {photo && (
          <>
            <img
              className={photo.small ? 'is-small' : undefined}
              src={photo.src}
              alt={photo.alt}
            />
            <div className="lightbox-bottom">
              <button onClick={() => move(-1)} aria-label="Previous photograph">
                ←
              </button>
              <div aria-live="polite">
                <h2 id="lightbox-title">{photo.title}</h2>
                <p>{photo.description}</p>
                <a href={photo.source} target="_blank" rel="noreferrer">
                  Official image source ↗
                </a>
                <span>
                  {' '}
                  · {index + 1} / {filtered.length}
                </span>
              </div>
              <button onClick={() => move(1)} aria-label="Next photograph">
                →
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
