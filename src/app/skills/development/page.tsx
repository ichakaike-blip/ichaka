import { Reveal } from "@/components/reveal";

const sampleProjects = [
  {
    title: "Marketing Site Revamp",
    type: "Website",
    href: "#",
  },
  {
    title: "SaaS Dashboard",
    type: "GitHub Repo",
    href: "#",
  },
  {
    title: "Creator Analytics Tool",
    type: "Project Snapshot",
    href: "#",
  },
];

export default function DevelopmentSkillsPage() {
  return (
    <section className="space-y-8">
      <Reveal>
        <h1 className="text-3xl font-semibold md:text-4xl">Development</h1>
      </Reveal>
      <Reveal delay={0.05}>
        <p className="muted max-w-2xl">
          Websites, products, screenshots, and public repositories. Replace placeholders with your
          real portfolio entries from Sanity.
        </p>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-3">
        {sampleProjects.map((item, index) => (
          <Reveal delay={0.08 + index * 0.05} key={item.title}>
            <a href={item.href} className="card block border-black/10 dark:border-white/10">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] muted">{item.type}</p>
              <h2 className="text-lg font-medium">{item.title}</h2>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
