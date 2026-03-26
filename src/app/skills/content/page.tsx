import { Reveal } from "@/components/reveal";

const sampleContent = [
  { title: "How I use AI tools to ship faster", platform: "Article", href: "#" },
  { title: "Thread: Product thinking for creators", platform: "Twitter/X", href: "#" },
  { title: "Writing systems that scale", platform: "Article", href: "#" },
];

export default function ContentSkillsPage() {
  return (
    <section className="space-y-8">
      <Reveal>
        <h1 className="text-3xl font-semibold md:text-4xl">Content Creation</h1>
      </Reveal>
      <Reveal delay={0.05}>
        <p className="muted max-w-2xl">
          Articles, educational threads, and creator-focused writing. Replace sample links with
          your live posts from Sanity.
        </p>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2">
        {sampleContent.map((item, index) => (
          <Reveal delay={0.08 + index * 0.05} key={item.title}>
            <a href={item.href} className="card block border-black/10 dark:border-white/10">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] muted">{item.platform}</p>
              <h2 className="text-lg font-medium">{item.title}</h2>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
