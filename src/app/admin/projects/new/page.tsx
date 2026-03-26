import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">New Project</h1>
        <p className="text-white/60">Create a new portfolio project</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <ProjectForm />
      </div>
    </div>
  );
}
