import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteContentProjectButton from "@/components/admin/DeleteContentProjectButton";

export const dynamic = "force-dynamic";

export default async function ContentProjectsPage() {
  const projects = await prisma.contentProject.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Content Projects</h1>
          <p className="text-foreground/60">Manage articles and thread projects</p>
        </div>
        <Link
          href="/admin/content-projects/new"
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-foreground rounded font-medium transition"
        >
          New Content Project
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-foreground/5 border border-foreground/10 rounded-lg p-4 flex items-center justify-between hover:bg-foreground/10 transition"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-foreground font-medium truncate">{project.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-foreground/50 text-sm">/content-projects ({project.slug})</p>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-foreground/10 text-foreground/70">
                    Order: {project.order}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      project.published
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {project.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className="text-foreground/50 text-sm">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <Link
                  href={`/admin/content-projects/${project.id}/edit`}
                  className="px-3 py-1 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded text-sm transition"
                >
                  Edit
                </Link>
                <DeleteContentProjectButton id={project.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-foreground/60 mb-4">No content projects yet</p>
          <Link
            href="/admin/content-projects/new"
            className="inline-block px-4 py-2 bg-orange-500 hover:bg-orange-600 text-foreground rounded font-medium transition"
          >
            Create First Content Project
          </Link>
        </div>
      )}
    </div>
  );
}
