import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";
import ProjectOrderControls from "@/components/admin/ProjectOrderControls";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-white/60">Manage your portfolio projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-medium transition"
        >
          New Project
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-2">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{project.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-white/50 text-sm">/projects#{project.slug}</p>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-white/10 text-white/70">
                    Order: {project.order}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className="text-white/50 text-sm">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <ProjectOrderControls
                  id={project.id}
                  order={project.order}
                  canMoveUp={index > 0}
                  canMoveDown={index < projects.length - 1}
                />
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition"
                >
                  Edit
                </Link>
                <DeleteProjectButton id={project.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/60 mb-4">No projects yet</p>
          <Link
            href="/admin/projects/new"
            className="inline-block px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-medium transition"
          >
            Create First Project
          </Link>
        </div>
      )}
    </div>
  );
}
