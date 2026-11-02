import Link from 'next/link';
import { Intro, Breadcrumb, Source } from '@/components/UI';
import { official } from '@/data/content';
import GalleryExplorer from '@/components/GalleryExplorer';
export const metadata = { title: 'The campus collection' };
export default function Gallery() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Gallery' }]} />
      <Intro
        number="03"
        title={
          <>
            A place to learn.
            <br />
            <em>A place to belong.</em>
          </>
        }
        description="Campus, residences, academics, sport and student life, in photographs published by LNMIIT. Choose one to take a closer look."
      />
      <section className="wrap section compact">
        <div className="cm-gallery-link">
          <div>
            <strong>See the campus in a new dimension.</strong>
            <p>Orbit the satellite-aligned model and explore its landmarks.</p>
          </div>
          <Link href="/campus-map/">Explore the 3D map ↗</Link>
        </div>
        <GalleryExplorer />
        <div className="source-note">
          <p>
            Photographs and film frames come from LNMIIT’s official websites.
            Each enlarged view links to its source. Captions describe the
            images; the sources do not give photograph dates.
          </p>
          <Source href={official + '/admissions/'} label="Visit lnmiit.ac.in" />
        </div>
      </section>
    </>
  );
}
