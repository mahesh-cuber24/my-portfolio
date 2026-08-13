import { useState } from 'react';
import Section, { Reveal } from './Section';
import ExpandableCard from './ExpandableCard';
import { experience } from '../data/experience';

export default function Experience() {
  const [openId, setOpenId] = useState(null);

  return (
    <Section
      id="experience"
      index="02"
      name="Experience"
      title="Making radar detection adaptive."
      lead="Expand for the full engineering breakdown — including the three silent bugs that had to be found before any of it could be trusted."
    >
      <div>
        {experience.map((role) => (
          <Reveal key={role.id}>
            <ExpandableCard
              entry={{
                ...role,
                index: `${role.start} — ${role.end}`,
                subtitle: `${role.org} · ${role.orgNote}`,
                year: role.location,
              }}
              isOpen={openId === role.id}
              onToggle={() => setOpenId((current) => (current === role.id ? null : role.id))}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
