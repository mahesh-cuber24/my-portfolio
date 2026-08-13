// Bare stat tiles — a headline number plus what it measures. No plot, so no hover
// layer; values stay in ink rather than wearing an accent colour.
export default function MetricTiles({ metrics }) {
  if (!metrics?.length) return null;

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-surface px-5 py-6">
          <dt className="sr-only">{metric.label}</dt>
          <dd>
            <span className="block font-display text-3xl font-semibold tracking-tight tabular-nums text-ink">
              {metric.value}
            </span>
            <span className="mt-2 block text-xs leading-snug text-muted">{metric.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
