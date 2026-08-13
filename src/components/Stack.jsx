import Section, { Reveal } from './Section';
import Marquee from './Marquee';
import { marqueeItems, skills } from '../data/skills';

export default function Stack() {
  return (
    <>
      <Section id="stack" index="04" name="Stack" title="What I build with.">
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.07} className="bg-bg">
              <div className="group h-full p-7 transition-colors duration-500 hover:bg-surface">
                <div className="flex items-baseline justify-between">
                  <h3 className="label">{group.title}</h3>
                  <span className="label transition-colors duration-300 group-hover:text-accent-text">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <ul className="mt-6 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="text-[15px] text-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Marquee items={marqueeItems} />
    </>
  );
}
