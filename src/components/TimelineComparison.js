import Link from 'next/link';
export default function TimelineComparison({ variant }) {
  return (
    <div className="timeline-comparison" id="timeline-comparison">
      <div>
        <span>COMPARE THE PROTOTYPES</span>
        <p>
          {variant === 'vertical'
            ? 'A continuous journey, led by the milestones.'
            : 'The original pinned, image-led timeline.'}
        </p>
      </div>
      <nav aria-label="Choose timeline prototype">
        <Link
          href="/prototype-vertical/#timeline-comparison"
          aria-current={variant === 'vertical' ? 'page' : undefined}
        >
          Vertical <span>NEW</span>
        </Link>
        <Link
          href="/prototype-horizontal/#timeline-comparison"
          aria-current={variant === 'horizontal' ? 'page' : undefined}
        >
          Horizontal <span>ORIGINAL</span>
        </Link>
      </nav>
    </div>
  );
}
