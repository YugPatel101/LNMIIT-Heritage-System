import { Breadcrumb, Intro, Source } from '@/components/UI';
import {
  sources,
  departments,
  checked,
  motto,
  official,
  photoSource,
} from '@/data/content';
export const metadata = { title: 'Sources & credits' };
export default function Sources() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Sources & credits' }]} />
      <Intro
        number="05"
        title={
          <>
            Rooted in
            <br />
            <em>official sources.</em>
          </>
        }
        description="Institutional information is summarised from LNMIIT’s official pages. Follow the links to explore the original material."
      />
      <section className="wrap section compact source-directory">
        <p className="checked">
          Content reviewed: {checked}. This is a curated snapshot, not a live
          data feed.
        </p>
        <h2>Institutional information</h2>
        <ul className="lined-list">
          {sources.map(([title, url]) => (
            <li key={url}>
              <span>{title}</span>
              <Source href={url} label="View source" />
            </li>
          ))}
        </ul>
        <h2>Academic departments</h2>
        <ul className="source-departments">
          {departments.map((d) => {
            const more = d.research
              ? ['Research', d.research]
              : d.facilities
                ? ['Facilities', d.facilities]
                : null;
            return (
              <li key={d.slug}>
                <span className="eyebrow">
                  {d.code} · {d.group}
                </span>
                <h3>{d.name}</h3>
                <div>
                  <Source href={d.source} label="Department" />
                  <Source href={d.programSource} label="Programmes" />
                  <Source href={d.source + 'people/'} label="People" />
                  {more ? (
                    <Source href={more[1]} label={more[0]} />
                  ) : (
                    <span className="source-none">No research page listed</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <h2>Motto</h2>
        <p>
          “{motto.join(' ')}” appears on the homepage in the wording given by
          Wikipedia, which cites no source. It was not found on the 222 pages of
          LNMIIT’s official sitemap or in 38 of its institutional PDFs, so it
          should be confirmed with the institute.
        </p>
        <h2>Photographs & attribution</h2>
        <p>
          Photographs were downloaded from LNMIIT’s official websites, and each
          enlarged view in the gallery links to the page it came from. Film
          frames come from the official campus film. Photo dates are not
          specified by the sources. Some photographs carry student-photographer
          watermarks, retained as published, and individual photographers are
          otherwise not credited on the source pages. Images remain the property
          of their respective rights holders. Images were resized and converted
          to WebP only; none were retouched or generated.
        </p>
        <div className="source-row">
          <Source href={official + '/admissions/'} label="Admissions page" />
          <Source href={official + '/facilities/'} label="Facilities page" />
          <Source href={official + '/about/'} label="About page" />
          <Source href={official + '/campus-life/'} label="Campus life page" />
          <Source href={photoSource} label="ICMC 2026 website" />
        </div>
        <h2>Student life</h2>
        <p>
          The club and council list comes from the Student Gymkhana website; the
          Gymkhana’s structure from its constitution; and club descriptions,
          where stated, from the 2015–16 Institute Brochure and the fest
          websites. E-Summit details come from LNMIIT’s events page and from
          E-Cell’s own website and LinkedIn page, so its figures are
          self-reported. Major event details and photographs come from each
          event’s website, and TEDxLNMIIT dates from TED’s event listings.
          Student names and phone numbers are deliberately left out; the
          official pages list them.
        </p>
        <h2>3D campus model</h2>
        <p>
          The model places every building on its real footprint. Roof outlines
          were traced by hand from satellite imagery, and each roof shows the
          satellite photograph of that roof. Walls are representative artwork
          based on the campus drone film and official photographs. Trees stand
          where imagery shows canopy, with illustrative shapes. Heights are
          estimated from floor counts and are not measured. The open-air theatre
          stage is placed from the imagery; its height and backdrop are
          representative. It is not a Google Earth 3D export or a surveyed
          navigation map.
        </p>
        <p>
          Satellite imagery, streamed to your browser and not stored by this
          site: Esri, Vantor, Earthstar Geographics and the GIS User Community (
          <a
            href="https://www.esri.com/en-us/legal/terms/full-master-agreement"
            target="_blank"
            rel="noreferrer"
          >
            Esri terms
          </a>
          ). Building names, roads and paths: ©{' '}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
          >
            OpenStreetMap contributors
          </a>
          , available under the Open Database License. Surrounding buildings:{' '}
          <a href="https://overturemaps.org/" target="_blank" rel="noreferrer">
            Overture Maps Foundation
          </a>
          , including Google Open Buildings and Microsoft ML Buildings.
          Elevation: Mapzen Terrain Tiles, derived from SRTM and other public
          data.
        </p>
        <p>
          The project owner’s annotated Google Earth screenshots of 23 October
          2026 and later corrections identify the places in the explorer,
          including BH3, GH, GH Extension, both messes and the AI centre’s
          construction status. Where OpenStreetMap disagrees, as with GH
          Extension, which it labels BH-5, the owner’s name is used. The
          reference picture in the map’s dialog is an AI-generated illustration,
          not a photograph or survey, and its pins mark where each place is
          drawn in that picture.
        </p>
        <h2>About this project</h2>
        <p>
          Phase 1 of the LNMIIT Heritage Application, developed as a student
          mini project by Patel Yug Dilipkumar (24UCS068) and Vadalia Parth
          (24UCS168), under the supervision of Dr Saurabh Kumar.
        </p>
        <p>
          This educational portal is not an official admissions service. Contact
          details, application requirements and notices should always be
          confirmed on LNMIIT’s official website.
        </p>
      </section>
    </>
  );
}
