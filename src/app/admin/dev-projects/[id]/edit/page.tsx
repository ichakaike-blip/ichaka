import DevProjectForm from "@/components/admin/DevProjectForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditDevProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.devProject.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Edit Development Project</h1>
        <p className="text-foreground/60">{project.title}</p>
      </div>

      <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
        <DevProjectForm
          initialData={{
            id: project.id,
            title: project.title,
            slug: project.slug,
            description: project.description,
            link: project.link,
            order: project.order,
            published: project.published,
          }}
        />
      </div>
    </div>
  );
}
