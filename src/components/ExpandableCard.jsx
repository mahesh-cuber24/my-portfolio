import { useId } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Plus } from 'lucide-react';
import MetricTiles from './MetricTiles';
import { GithubIcon } from './BrandIcons';

const EASE = [0.22, 1, 0.36, 1];

const linkLabels = {
  demo: 'Live demo',
  github: 'Source',
  docs: 'API docs',
};

// One row of the work list. Collapsed it is a single toggle button; every link
// lives inside the expanded panel so nothing interactive nests inside the button.
export default function ExpandableCard({ entry, isOpen, onToggle }) {
  const panelId = useId();
  const { detail } = entry;

  return (
    <div className="border-t border-line last:border-b">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        data-cursor={isOpen ? 'Close' : 'Expand'}
        className="group relative flex w-full items-start gap-5 py-8 text-left sm:gap-10"
      >
        {/* accent wash that wipes in from the left on hover */}
        <span className="pointer-events-none absolute inset-y-0 -inset-x-4 origin-left scale-x-0 bg-accent/[0.05] transition-transform duration-500 ease-out group-hover:scale-x-100" />

        <span className="relative label hidden shrink-0 pt-2 tabular-nums whitespace-nowrap transition-colors duration-300 group-hover:text-accent-text sm:block">
          {entry.index}
        </span>

        <span className="relative min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="font-display text-2xl leading-tight font-semibold sm:text-3xl">
              {entry.title}
            </h3>
            {entry.year && <span className="label">{entry.year}</span>}
          </span>

          {entry.subtitle && (
            <span className="mt-1.5 block font-serif text-lg italic text-muted">
              {entry.subtitle}
            </span>
          )}

          <span className="mt-4 block max-w-2xl leading-relaxed text-muted">{entry.blurb}</span>

          <span className="mt-5 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="border border-line px-2.5 py-1 font-mono text-[11px] text-faint"
              >
                {tag}
              </span>
            ))}
          </span>
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="relative mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-colors duration-300 group-hover:border-accent group-hover:text-accent"
        >
          <Plus size={17} strokeWidth={1.5} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-14 sm:pl-[4.5rem]">
              <p className="max-w-3xl text-lg leading-relaxed text-ink/85">{detail.overview}</p>

              {entry.metrics?.length > 0 && (
                <div className="mt-10">
                  <p className="label mb-4">By the numbers</p>
                  <MetricTiles metrics={entry.metrics} />
                </div>
              )}

              {/* Charts slot — drop <ProjectChart /> blocks in here as they're built. */}
              {entry.charts}

              <div className="mt-12 grid gap-12 lg:grid-cols-2">
                <div>
                  <p className="label mb-5">What it does</p>
                  <ul className="space-y-4">
                    {detail.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-4 text-sm leading-relaxed text-muted">
                        <span className="mt-2 h-px w-4 shrink-0 bg-accent" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="label mb-5">What went wrong, and the fix</p>
                  <ul className="space-y-6">
                    {detail.challenges.map((challenge) => (
                      <li key={challenge.title}>
                        <h4 className="font-display text-base font-semibold">{challenge.title}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{challenge.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-12">
                <p className="label mb-4">Built with</p>
                <div className="flex flex-wrap gap-2">
                  {detail.stack.map((tech) => (
                    <span
                      key={tech}
                      className="bg-surface px-3 py-1.5 font-mono text-[11px] text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {detail.status && (
                <p className="mt-10 max-w-3xl border-l-2 border-accent pl-5 text-sm leading-relaxed text-muted">
                  {detail.status}
                </p>
              )}

              {Object.keys(entry.links ?? {}).length > 0 && (
                <div className="mt-10 flex flex-wrap gap-3">
                  {Object.entries(entry.links).map(([key, href]) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="Open"
                      className="inline-flex items-center gap-2 border border-line-strong px-5 py-2.5 font-mono text-xs tracking-wider uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
                    >
                      {key === 'github' ? <GithubIcon size={14} /> : <ArrowUpRight size={14} />}
                      {linkLabels[key] ?? key}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
