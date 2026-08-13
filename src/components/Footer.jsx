import { site } from '../data/site';

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <p className="font-mono text-[11px] tracking-wider text-faint uppercase">
          {site.name} — {new Date().getFullYear()}
        </p>
        <p className="font-mono text-[11px] tracking-wider text-faint uppercase">
          React · Vite · Tailwind · Motion
        </p>
      </div>
    </footer>
  );
}
