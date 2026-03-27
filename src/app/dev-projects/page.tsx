import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Development Projects | ichaka",
  description: "Websites and app projects built by Ichaka.",
  openGraph: {
    title: "Development Projects | ichaka",
    description: "Websites and app projects built by Ichaka.",
    images: ["/api/og?title=Development%20Projects"],
  },
};

export default async function DevProjectsPage() {
  const projects = await prisma.devProject.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <section className="space-y-8">
      <Reveal>
        <h1 className="text-3xl font-semibold md:text-4xl">Development Projects</h1>
      </Reveal>

      {projects.length === 0 ? (
        <Reveal delay={0.05}>
          <div className="card border-black/10 dark:border-white/10">
            <p className="muted">No development projects available yet.</p>
          </div>
        </Reveal>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal delay={0.06 + index * 0.03} key={project.id}>
              <Link href={`/dev-projects/${project.slug}`} className="block card border-black/10 dark:border-white/10">
                <div className="relative w-full aspect-video rounded overflow-hidden border border-black/10 dark:border-white/10 pointer-events-none">
                  <iframe
                    src={project.link}
                    title={project.title}
                    className="w-full h-full"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>

                <h2 className="mt-4 text-xl font-medium">{project.title}</h2>
                <p className="mt-2 text-sm muted line-clamp-3">{project.description}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
