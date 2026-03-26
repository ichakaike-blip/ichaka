import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Projects | ichaka",
  description: "Selected projects by Ichaka.",
  openGraph: {
    title: "Projects | ichaka",
    description: "Selected projects by Ichaka.",
    images: ["/api/og?title=Projects"],
  },
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <section className="space-y-8">
      <Reveal>
        <h1 className="text-3xl font-semibold md:text-4xl">Projects</h1>
      </Reveal>

      {projects.length === 0 ? (
        <Reveal delay={0.05}>
          <div className="card border-black/10 dark:border-white/10">
            <p className="muted">No projects available yet.</p>
          </div>
        </Reveal>
      ) : (
        <div className="grid gap-4">
          {projects.map((project, index) => (
            <Reveal delay={0.08 + index * 0.04} key={project.id}>
              <article className="card border-black/10 transition hover:border-cyan-400 dark:border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-medium">{project.title}</h2>
                    <p className="mt-2 muted">{project.description}</p>
                  </div>
                  <span className="mono text-[11px] uppercase tracking-[0.16em] muted">
                    #{project.order}
                  </span>
                </div>

                {project.link ? (
                  <Link
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono mt-5 inline-block text-xs uppercase tracking-[0.16em] text-cyan-400"
                  >
                    Open project
                  </Link>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
