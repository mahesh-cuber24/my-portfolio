import { useState } from 'react';
import Section, { Reveal } from './Section';
import ExpandableCard from './ExpandableCard';
import { projects } from '../data/projects';

export default function Projects() {
  // One row open at a time; clicking the open row closes it.
  const [openId, setOpenId] = useState(null);

  return (
    <Section
      id="projects"
      index="03"
      name="Selected Work"
      title="Three things I built end to end."
      lead="Each one expands into the full breakdown — what it does, the numbers behind it, and the problems that only showed up once it met real data."
    >
      <div>
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={index * 0.06}>
            <ExpandableCard
              entry={project}
              isOpen={openId === project.id}
              onToggle={() => setOpenId((current) => (current === project.id ? null : project.id))}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
