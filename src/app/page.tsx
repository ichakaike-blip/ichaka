import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionProgress } from "@/components/section-progress";

export const metadata: Metadata = {
  title: "Home | ichaka",
  description: "Ikueze Excel Ikenna portfolio home.",
  openGraph: {
    title: "Home | ichaka",
    description: "Ikueze Excel Ikenna portfolio home.",
    images: ["/api/og?title=Ichaka"],
  },
};

const homeSections = [
  { id: "manifesto", label: "P.001" },
  { id: "build", label: "P.002" },
  { id: "write", label: "P.003" },
  { id: "channel", label: "P.004" },
];

export default function HomePage() {
  return (
    <div className="space-y-24 pb-24 md:space-y-32 md:pb-32">
      <SectionProgress sections={homeSections} />

      <section id="manifesto" className="relative min-h-[calc(100vh-140px)] scroll-mt-20">
        <Reveal>
          <div className="mono mb-6 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] muted md:mb-10">
            <p>P.001 / Manifesto</p>
            <p>Vol. 1 / 2026</p>
          </div>
        </Reveal>

        <Reveal delay={0.04}>
          <div className="hero-stack">
            <h1 className="hero-name hero-name-top">EXCEL</h1>
            <h1 className="hero-name hero-name-bottom">IKUEZE</h1>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="mono max-w-2xl text-[11px] uppercase tracking-[0.2em] muted md:text-xs">
              Jack of all trades. Master of a few. Product-minded execution from idea to final ship.
            </p>
            <p className="mono text-[11px] uppercase tracking-[0.2em] text-orange-500 md:text-xs">
              Scroll to tune in
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-950 transition hover:bg-orange-400"
            >
              Send a message
            </Link>
            <Link
              href="/about"
              className="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-100 transition hover:bg-white/10"
            >
              Read profile
            </Link>
          </div>
        </Reveal>
      </section>

      <section id="build" className="grid scroll-mt-20 gap-8 md:grid-cols-2 md:gap-10">
        <Reveal>
          <div className="card border-white/10">
            <p className="chapter-label">P.002 / What I Build</p>
            <h2 className="mt-4 text-3xl font-semibold uppercase tracking-[-0.02em]">Development</h2>
            <p className="mt-4 muted">
              Production-grade websites, SaaS products, internal dashboards, and frontend systems
              that actually convert and scale.
            </p>
            <Link href="/dev-projects" className="mono mt-6 inline-block text-xs uppercase tracking-[0.16em] text-orange-500">
              View development work
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div id="write" className="card border-white/10 scroll-mt-20">
            <p className="chapter-label">P.003 / What I Write</p>
            <h2 className="mt-4 text-3xl font-semibold uppercase tracking-[-0.02em]">Content</h2>
            <p className="mt-4 muted">
              Articles and social threads that make technical ideas clear, memorable, and useful
              to both teams and audiences.
            </p>
            <Link href="/content-projects" className="mono mt-6 inline-block text-xs uppercase tracking-[0.16em] text-orange-500">
              View content work
            </Link>
          </div>
        </Reveal>
      </section>

      <section id="channel" className="scroll-mt-20">
        <Reveal>
          <div className="card border-white/10 md:p-8">
            <p className="chapter-label">P.004 / Open Channel</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold uppercase tracking-[-0.02em] md:text-5xl">
              Let&apos;s make something that means something.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-950 transition hover:bg-orange-400"
              >
                Start a project
              </Link>
              <Link
                href="/blog"
                className="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-100 transition hover:bg-white/10"
              >
                Read the blog
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
