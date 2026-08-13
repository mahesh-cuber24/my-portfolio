// Infinite ticker. The item list is rendered twice so the -50% translate loops seamlessly.
export default function Marquee({ items }) {
  return (
    <div className="relative flex overflow-hidden border-y border-line py-5 select-none">
      <div className="marquee-track flex w-max shrink-0 items-center gap-10 pr-10">
        {[...items, ...items].map((item, index) => (
          <span key={index} className="flex shrink-0 items-center gap-10">
            <span className="font-display text-xl font-medium whitespace-nowrap text-muted">
              {item}
            </span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
          </span>
        ))}
      </div>

      {/* fade the ticker into the page edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
