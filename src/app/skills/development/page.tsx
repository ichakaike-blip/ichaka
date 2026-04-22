import Link from "next/link";
import { unstable_cache } from "next/cache";
import { Reveal } from "@/components/reveal";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

const getDevProjects = unstable_cache(
  async () =>
    prisma.devProject.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
  ["all-dev-projects-skills"],
  { revalidate: 3600 }
);

export default async function DevelopmentSkillsPage() {
  const projects = await getDevProjects();

  return (
    <section className="space-y-8">
      <Reveal>
        <h1 className="text-3xl font-semibold md:text-4xl">Development</h1>
      </Reveal>
      <Reveal delay={0.05}>
        <p className="muted max-w-2xl">
          Real project work, linked to live URLs and paired with visual previews.
        </p>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-3">
        {projects.length === 0 ? (
          <Reveal delay={0.08}>
            <div className="card border-black/10 dark:border-white/10 md:col-span-3">
              <p className="muted">No projects published yet.</p>
              <Link href="/admin/dev-projects" className="mono mt-4 inline-block text-xs uppercase tracking-[0.16em] text-orange-500">
                Add projects in admin
              </Link>
            </div>
          </Reveal>
        ) : projects.map((item, index: number) => (
          <Reveal delay={0.08 + index * 0.05} key={item.title}>
            <Link
              href={`/dev-projects/${item.slug}`}
              className="card block border-black/10 transition hover:border-orange-500 dark:border-white/10"
            >
              <p className="mb-2 text-xs uppercase tracking-[0.2em] muted">
                Project Details
              </p>
              <h2 className="text-lg font-medium">{item.title}</h2>
              <p className="mt-2 text-sm muted line-clamp-3">{item.description}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
