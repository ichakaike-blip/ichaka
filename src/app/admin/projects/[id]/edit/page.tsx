import ProjectForm from "@/components/admin/ProjectForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Project</h1>
        <p className="text-white/60">{project.title}</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <ProjectForm initialData={project} />
      </div>
    </div>
  );
}
