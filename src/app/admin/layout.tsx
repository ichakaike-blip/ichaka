import { auth, isAdminEmail, signOut } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname");

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const session = await auth();

  if (!isAdminEmail(session?.user?.email)) {
    redirect("/admin/login");
  }

  const adminEmail = session?.user?.email ?? "";

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-white/10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-2">ICHAKA</h1>
          <p className="text-white/50 text-sm">Admin Panel</p>
        </div>

        <nav className="space-y-1 px-3 py-6">
          <NavLink href="/admin/dashboard" label="Dashboard" />
          <NavLink href="/admin/blog" label="Blog Posts" />
          <NavLink href="/admin/projects" label="Projects" />
        </nav>

        <div className="border-t border-white/10 p-4 mt-8">
          <p className="text-xs text-white/50 mb-3">
            Signed in as: <br />
            <span className="text-white/70">{adminEmail}</span>
          </p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="w-full px-3 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition"
    >
      {label}
    </Link>
  );
}
