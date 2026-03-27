import DevProjectForm from "@/components/admin/DevProjectForm";

export default function NewDevProjectPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">New Development Project</h1>
        <p className="text-foreground/60">Create a new website or app project</p>
      </div>

      <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
        <DevProjectForm />
      </div>
    </div>
  );
}
