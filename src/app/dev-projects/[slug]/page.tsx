import type { Metadata } from "next";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

const getDevProjectBySlug = (slug: string) =>
  unstable_cache(
    async () =>
      prisma.devProject.findUnique({
        where: { slug },
      }),
    [`dev-project-${slug}`],
    { revalidate: 3600 }
  )();

marked.setOptions({
  breaks: true,
  gfm: true,
});


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getDevProjectBySlug(slug);

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

  const project = await getDevProjectBySlug(slug);

  if (!project || !project.published) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="mono text-xs uppercase tracking-[0.2em] muted">Development Project</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{project.title}</h1>
        <div
          className="mt-3 max-w-3xl prose prose-p:muted prose-p:leading-7 prose-p:mb-4 dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: marked.parse(project.description) as string }}
        />
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
