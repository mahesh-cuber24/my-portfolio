import { ArrowUpRight } from 'lucide-react';
import Section, { Reveal } from './Section';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { site } from '../data/site';

const channels = [
  { label: 'Email', value: site.email, href: `mailto:${site.email}`, Icon: null },
  { label: 'LinkedIn', value: site.linkedinHandle, href: site.linkedin, Icon: LinkedinIcon },
  { label: 'GitHub', value: site.githubHandle, href: site.github, Icon: GithubIcon },
];

export default function Contact() {
  return (
    <Section
      id="contact"
      index="05"
      name="Contact"
      title={
        <>
          Let’s build something that <span className="serif-accent text-accent">ships.</span>
        </>
      }
      lead={`I'm open to AI / ML Engineer roles. Email is the fastest way to reach me.`}
    >
      <div className="border-t border-line">
        {channels.map(({ label, value, href, Icon }, index) => {
          const isExternal = !href.startsWith('mailto:');
          return (
            <Reveal key={label} delay={index * 0.07}>
              <a
                href={href}
                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                data-cursor={isExternal ? 'Open' : 'Email'}
                className="group relative flex items-center justify-between gap-6 border-b border-line py-7"
              >
                <span className="pointer-events-none absolute inset-y-0 -inset-x-4 origin-left scale-x-0 bg-accent/[0.05] transition-transform duration-500 ease-out group-hover:scale-x-100" />

                {/* stacks on narrow screens — the LinkedIn handle overflows a single row */}
                <span className="relative flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-5">
                  <span className="flex items-center gap-3">
                    {Icon && (
                      <Icon
                        size={15}
                        className="shrink-0 text-faint transition-colors duration-300 group-hover:text-accent sm:hidden"
                      />
                    )}
                    <span className="label sm:w-20 sm:shrink-0">{label}</span>
                  </span>
                  {Icon && (
                    <Icon
                      size={17}
                      className="hidden shrink-0 text-faint transition-colors duration-300 group-hover:text-accent sm:block"
                    />
                  )}
                  <span className="truncate font-display text-base font-medium transition-transform duration-500 ease-out group-hover:translate-x-1 sm:text-2xl">
                    {value}
                  </span>
                </span>

                <ArrowUpRight
                  size={20}
                  strokeWidth={1.5}
                  className="relative shrink-0 text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                />
              </a>
            </Reveal>
          );
        })}
      </div>

    </Section>
  );
}
