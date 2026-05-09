import Link from "next/link";
import Image from "next/image";
import { unstable_cache } from "next/cache";
import { Reveal } from "@/components/reveal";
import { prisma } from "@/lib/prisma";
import { cloudinaryFetch, extractRawUrl } from "@/lib/cloudinary";

export const revalidate = 3600;

const getContentProjects = unstable_cache(
  async () =>
    prisma.contentProject.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
  ["all-content-projects-skills"],
  { revalidate: 3600 }
);

export default async function ContentSkillsPage() {
  const projects = await getContentProjects();

  return (
    <section className="space-y-8">
      <Reveal>
        <h1 className="text-3xl font-semibold md:text-4xl">Content Creation</h1>
      </Reveal>
      <Reveal delay={0.05}>
        <p className="muted max-w-2xl">
          Content-focused projects, writing pieces, and campaigns.
        </p>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.length === 0 ? (
          <Reveal delay={0.08}>
            <div className="card border-black/10 dark:border-white/10 md:col-span-2">
              <p className="muted">No content projects yet.</p>
              <Link href="/admin/content-projects" className="mono mt-4 inline-block text-xs uppercase tracking-[0.16em] text-orange-500">
                Add content projects in admin
              </Link>
            </div>
          </Reveal>
        ) : projects.map((item, index: number) => (
          <Reveal delay={0.08 + index * 0.05} key={item.title}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card block border-black/10 dark:border-white/10"
            >
              {item.imageUrl ? (
                <Image
                  src={cloudinaryFetch(extractRawUrl(item.imageUrl), { width: 1280 })}
                  alt={`${item.title} preview`}
                  width={640}
                  height={360}
                  unoptimized={true}
                  className="mb-3 h-36 w-full rounded-lg border border-black/10 object-cover dark:border-white/10"
                />
              ) : null}
              <p className="mb-2 text-xs uppercase tracking-[0.2em] muted">Content Project</p>
              <h2 className="text-lg font-medium">{item.title}</h2>
              <p className="mt-2 text-sm muted line-clamp-3">{item.description}</p>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
