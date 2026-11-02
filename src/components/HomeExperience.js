import Link from 'next/link';
import CampusHero from '@/components/CampusHero';
import ParallaxTimeline from '@/components/ParallaxTimeline';
import VerticalTimeline from '@/components/VerticalTimeline';
import TimelineComparison from '@/components/TimelineComparison';
import { departments, officialUrl } from '@/data/content';
import { clubs } from '@/data/student-life';
export default function HomeExperience({
  variant = 'vertical',
  showComparison = false,
}) {
  return (
    <div className="prototype-home">
      <CampusHero />
      {showComparison && <TimelineComparison variant={variant} />}
      {variant === 'horizontal' ? <ParallaxTimeline /> : <VerticalTimeline />}
      <section id="discover" className="v2-explore v2-wrap">
        <p className="v2-kicker">FIND YOUR NEXT DISCOVERY</p>
        <h2>Explore life at LNMIIT.</h2>
        <div className="v2-photo-grid">
          <Link href="/gallery/" className="v2-photo-link">
            <div>
              <img
                src="/media/lnmiit2.jpg"
                alt="LNMIIT’s campus seen from above"
                loading="lazy"
              />
              <h3>
                The campus <span>↗</span>
              </h3>
            </div>
            <p>A place to learn. A place to belong.</p>
          </Link>
          <Link href="/heritage/" className="v2-photo-link">
            <div>
              <img
                src="/media/centralplaza.jpg"
                alt="Sunset over the central plaza"
                loading="lazy"
              />
              <h3>
                Our heritage <span>↗</span>
              </h3>
            </div>
            <p>The people, the vision, the milestones.</p>
          </Link>
        </div>
      </section>
      <section className="v2-life v2-wrap">
        <p className="v2-kicker">BEYOND THE CLASSROOM</p>
        <div className="v2-section-title">
          <h2>Run by students. Open to all of them.</h2>
          <Link href="/student-life/">Explore student life ↗</Link>
        </div>
        <div className="v2-life-links">
          <Link href="/student-life/#clubs">
            <span>
              <small>{clubs.length} CLUBS AND COMMITTEES</small>Clubs &
              communities
            </span>
            <b aria-hidden="true">↗</b>
          </Link>
          <Link href="/student-life/#societies">
            <span>
              <small>CHAPTERS AND STUDENT BODIES</small>Societies
            </span>
            <b aria-hidden="true">↗</b>
          </Link>
          <Link href="/student-life/#major-events">
            <span>
              <small>E-SUMMIT, VIVACITY, PLINTH AND MORE</small>Major events
            </span>
            <b aria-hidden="true">↗</b>
          </Link>
        </div>
      </section>
      <section className="v2-academics v2-wrap">
        <p className="v2-kicker">
          EIGHT DEPARTMENTS. ONE PURSUIT OF EXCELLENCE.
        </p>
        <div className="v2-section-title">
          <h2>
            Pursue excellence. Create knowledge.
            <br />
            Never stop learning.
          </h2>
          <Link href="/departments/">Explore all departments ↗</Link>
        </div>
        <div className="v2-academic-links">
          {departments.map((d, i) => (
            <a
              key={d.slug}
              href={officialUrl(d.source)}
              target="_blank"
              rel="noreferrer"
              aria-label={`${d.name}: official LNMIIT department page, opens in a new tab`}
            >
              <span>
                <small>
                  {String(i + 1).padStart(2, '0')} / {d.tagline}
                </small>
                {d.name}
              </span>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>
      </section>
      <section className="v2-cta">
        <div className="v2-wrap">
          <div>
            <p className="v2-kicker">MAKE YOUR NEXT MOVE</p>
            <h2>
              Your next chapter
              <br />
              starts here.
            </h2>
          </div>
          <Link href="/admissions/">
            Explore admissions <span>↗</span>
          </Link>
        </div>
      </section>
      {showComparison && (
        <div className="prototype-return v2-wrap">
          <span>How does this version feel?</span>
          <Link
            href={
              variant === 'vertical'
                ? '/prototype-horizontal/#timeline-comparison'
                : '/prototype-vertical/#timeline-comparison'
            }
          >
            Compare the {variant === 'vertical' ? 'horizontal' : 'vertical'}{' '}
            timeline ↗
          </Link>
        </div>
      )}
      <div className="v2-provenance v2-wrap">
        <span>
          Campus imagery & institutional history from official LNMIIT sources.
        </span>
        <Link href="/sources/">Sources & credits ↗</Link>
      </div>
    </div>
  );
}
