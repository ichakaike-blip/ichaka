"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { MobileNav } from "@/components/mobile-nav";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills/content", label: "Content" },
  { href: "/skills/development", label: "Development" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[rgb(var(--bg),0.75)] backdrop-blur-xl dark:border-white/10">
      <nav className="container-shell flex items-center justify-between py-3">
        <Link href="/" className="group relative flex flex-col leading-none">
          <span className="mono text-[10px] uppercase tracking-[0.22em] muted">Vol. 1 / 2026</span>
          <span className="mt-1 text-lg font-semibold tracking-tight">ichaka</span>
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className={`mono relative rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
                    active ? "text-current" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                  }`}
                >
                  {item.label}
                  <AnimatePresence>
                    {active ? (
                      <motion.span
                        layoutId="active-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-black/10 dark:bg-white/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    ) : null}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full border border-black/10 bg-white/75 p-2 text-zinc-800 hover:bg-white dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <MobileNav items={navItems} />
        </div>
      </nav>
    </header>
  );
}
