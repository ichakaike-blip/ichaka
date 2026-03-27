import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "Content Projects | ichaka",
  description: "Articles and X threads curated by Ichaka.",
  openGraph: {
    title: "Content Projects | ichaka",
    description: "Articles and X threads curated by Ichaka.",
    images: ["/api/og?title=Content%20Projects"],
  },
};

export default async function ContentProjectsPage() {
  const projects = await prisma.contentProject.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <section className="space-y-8">
      <Reveal>
        <h1 className="text-3xl font-semibold md:text-4xl">Content Projects</h1>
      </Reveal>

      {projects.length === 0 ? (
        <Reveal delay={0.05}>
          <div className="card border-black/10 dark:border-white/10">
            <p className="muted">No content projects available yet.</p>
          </div>
        </Reveal>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal delay={0.06 + index * 0.03} key={project.id}>
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block card border-black/10 transition hover:border-orange-500 dark:border-white/10"
              >
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={640}
                  height={360}
                  unoptimized
                  className="w-full aspect-video object-cover rounded mb-4"
                />
                <h2 className="text-xl font-medium">{project.title}</h2>
                <p className="mt-2 text-sm muted line-clamp-3">{project.description}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
