import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Subscribers</h1>
          <p className="text-foreground/60">Manage your blog newsletter list</p>
        </div>
        <div className="px-4 py-2 bg-foreground/5 text-foreground/80 rounded font-medium border border-foreground/10">
          Total: {subscribers.length}
        </div>
      </div>

      {subscribers.length > 0 ? (
        <div className="bg-foreground/5 border border-foreground/10 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-foreground/10 text-foreground/60 text-sm">
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-foreground/5 transition">
                  <td className="py-3 px-4">
                    <span className="text-foreground font-medium">{sub.email}</span>
                  </td>
                  <td className="py-3 px-4 text-foreground/60 text-sm">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-foreground/60 mb-4">No subscribers yet</p>
          <Link
            href="/admin/dashboard"
            className="inline-block px-4 py-2 bg-orange-500 hover:bg-orange-600 text-foreground rounded font-medium transition"
          >
            Back to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
