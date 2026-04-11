import { auth, hasAdminAccess } from "@/lib/auth";
import { cookies, headers } from "next/headers";
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
  const cookieStore = await cookies();
  const passcodeCookie = cookieStore.get("admin-passcode-auth")?.value ?? null;

  if (!hasAdminAccess(session?.user?.email, passcodeCookie)) {
    redirect("/admin/login");
  }

  const adminIdentity = passcodeCookie === "1" ? "Passcode session" : session?.user?.email ?? "";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-foreground/10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">ICHAKA</h1>
          <p className="text-foreground/50 text-sm">Admin Panel</p>
        </div>

        <nav className="space-y-1 px-3 py-6">
          <NavLink href="/admin/dashboard" label="Dashboard" />
          <NavLink href="/admin/blog" label="Blog Posts" />
          <NavLink href="/admin/submissions" label="Submissions" />
          <NavLink href="/admin/dev-projects" label="Development" />
          <NavLink href="/admin/content-projects" label="Content" />
        </nav>

        <div className="border-t border-foreground/10 p-4 mt-8">
          <p className="text-xs text-foreground/50 mb-3">
            Signed in as: <br />
            <span className="text-foreground/70">{adminIdentity}</span>
          </p>
          <a
            href="/api/admin/passcode-logout"
            className="block w-full px-3 py-2 text-center text-sm bg-foreground/10 hover:bg-foreground/20 text-foreground rounded transition"
          >
            Sign Out
          </a>
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
      className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
    >
      {label}
    </Link>
  );
}
