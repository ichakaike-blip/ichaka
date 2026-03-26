import PostForm from "@/components/admin/PostForm";

export default function NewBlogPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">New Blog Post</h1>
        <p className="text-white/60">Create a new blog post</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <PostForm />
      </div>
    </div>
  );
}
