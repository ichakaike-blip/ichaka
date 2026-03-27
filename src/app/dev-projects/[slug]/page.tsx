import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.devProject.findUnique({ where: { slug } });

  if (!project) {
    return {
      title: "Project Not Found | ichaka",
    };
  }

  return {
    title: `${project.title} | Development Projects`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Development Projects`,
      description: project.description,
      images: ["/api/og?title=" + encodeURIComponent(project.title)],
    },
  };
}

export default async function DevProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await prisma.devProject.findUnique({
    where: { slug },
  });

  if (!project || !project.published) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="mono text-xs uppercase tracking-[0.2em] muted">Development Project</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{project.title}</h1>
        <p className="mt-3 max-w-3xl muted">{project.description}</p>
      </div>

      <div className="relative w-full aspect-video rounded overflow-hidden border border-black/10 dark:border-white/10 pointer-events-auto">
        <iframe
          src={project.link}
          title={project.title}
          className="w-full h-full"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      <Link
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300"
      >
        Visit site {"->"}
      </Link>
    </section>
  );
}
