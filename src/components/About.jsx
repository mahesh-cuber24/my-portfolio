import Section, { Reveal } from './Section';
import { about } from '../data/site';

export default function About() {
  return (
    <Section
      id="about"
      index="01"
      name="About"
      title={
        <>
          I care about the part{' '}
          <span className="serif-accent text-accent">after the prototype.</span>
        </>
      }
    >
      <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <div className="space-y-6">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-2xl text-lg leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="border-t border-line">
            {about.facts.map((fact) => (
              <div
                key={fact.label}
                className="flex items-baseline justify-between gap-6 border-b border-line py-4"
              >
                <dt className="label shrink-0">{fact.label}</dt>
                <dd className="text-right text-sm text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <div className="mt-20 grid gap-14 border-t border-line pt-14 sm:grid-cols-2">
        <Reveal>
          <p className="label mb-6">Certifications</p>
          <ul className="space-y-4">
            {about.certifications.map((cert) => (
              <li key={cert.title}>
                <p className="font-display text-base font-semibold">{cert.title}</p>
                <p className="mt-1 text-sm text-muted">{cert.issuer}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="label mb-6">Beyond the work</p>
          <ul className="space-y-4">
            {about.achievements.map((achievement) => (
              <li key={achievement.title}>
                <p className="font-display text-base font-semibold">{achievement.title}</p>
                <p className="mt-1 text-sm text-muted">{achievement.detail}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
