import { auth, hasAdminAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SubmissionItemActions from "./SubmissionItem";
import WriterEmailBackfill from "./WriterEmailBackfill";

export const dynamic = "force-dynamic";

function parseSocials(value: string) {
  try {
    const parsed = JSON.parse(value) as {
      twitter?: string;
      linkedin?: string;
      substack?: string;
      website?: string;
    };
    return {
      twitter: parsed.twitter?.trim() || "",
      linkedin: parsed.linkedin?.trim() || "",
      substack: parsed.substack?.trim() || "",
      website: parsed.website?.trim() || "",
    };
  } catch {
    return { twitter: "", linkedin: "", substack: "", website: "" };
  }
}

export default async function AdminSubmissionsPage() {
  const session = await auth();
  const cookieStore = await cookies();
  const passcodeCookie = cookieStore.get("admin-passcode-auth")?.value ?? null;

  if (!hasAdminAccess(session?.user?.email, passcodeCookie)) {
    redirect("/admin/login");
  }

  const submissions = await prisma.blogPost.findMany({
    where: { status: "pending" },
    include: { writer: true },
    orderBy: { createdAt: "desc" },
  });

  const writersMissingEmail = await prisma.writer.findMany({
    where: {
      OR: [{ email: null }, { email: "" }],
    },
    include: {
      posts: {
        select: { title: true },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const writerBackfillItems = writersMissingEmail.map((writer) => ({
    id: writer.id,
    name: writer.name,
    postCount: writer._count.posts,
    latestPostTitle: writer.posts[0]?.title ?? "No post",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Submissions</h1>
        <p className="text-foreground/60">Review guest writer submissions before publishing.</p>
      </div>

      <WriterEmailBackfill initialWriters={writerBackfillItems} />

      {submissions.length === 0 ? (
        <p className="text-foreground/40 text-center py-8">No pending submissions.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const socials = submission.writer ? parseSocials(submission.writer.socials) : null;
            const previewId = `preview-${submission.id}`;

            return (
              <div key={submission.id} className="bg-foreground/5 border border-foreground/10 rounded-lg p-4 space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{submission.title}</h2>
                  <p className="text-sm text-foreground/50">/blog/{submission.slug}</p>
                  <p className="text-sm text-foreground/70 mt-2">{submission.excerpt}</p>
                </div>

                {submission.writer ? (
                  <div className="space-y-2 border-t border-foreground/10 pt-3">
                    <p className="text-sm text-foreground/90">Writer: {submission.writer.name}</p>
                    <p className="text-sm text-foreground/60">{submission.writer.bio}</p>
                    {socials ? (
                      <div className="flex flex-wrap gap-3">
                        {socials.twitter ? (
                          <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs hover:underline">X</a>
                        ) : null}
                        {socials.linkedin ? (
                          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs hover:underline">LinkedIn</a>
                        ) : null}
                        {socials.substack ? (
                          <a href={socials.substack} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs hover:underline">Substack</a>
                        ) : null}
                        {socials.website ? (
                          <a href={socials.website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs hover:underline">Website</a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <details className="space-y-2">
                  <summary className="cursor-pointer text-sm text-foreground/70">Preview</summary>
                  <pre id={previewId} className="text-xs text-foreground/60 whitespace-pre-wrap overflow-auto max-h-64">
                    {submission.content}
                  </pre>
                </details>

                <SubmissionItemActions id={submission.id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
