import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { SectionProgress } from "@/components/section-progress";

import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home | Ichaka",
  description: "Ikueze Excel Ikenna (ichaka). Jack of all trades. Master of a few.",
  openGraph: {
    title: "Ikueze Excel Ikenna (ichaka)",
    description: "Welcome to my portfolio. Jack of all trades. Master of a few.",
    images: ["/api/og?title=Ikueze%20Excel%20Ikenna"],
  },
};


const homeSections = [
  { id: "manifesto", label: "P.001" },
  { id: "build", label: "P.002" },
  { id: "write", label: "P.003" },
  { id: "channel", label: "P.004" },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ikueze Excel Ikenna",
    alternateName: ["ichaka", "EXCEL"],
    url: siteUrl,
    image: `${siteUrl}/hero.jpg`,
    sameAs: [
      "https://x.com/web3watch4l2",
      "https://github.com/ichakaike-blip",
      "https://www.linkedin.com/in/ikueze-excel-68aa64361/"
    ],
    jobTitle: "Product Manager & Full-Stack Developer",
    knowsAbout: [
      "Product Management",
      "Software Development",
      "Web Development",
      "Next.js",
      "React",
      "AI Technology",
      "Content Creation"
    ]
  };

  return (
    <div className="space-y-24 pb-24 md:space-y-32 md:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <SectionProgress sections={homeSections} />

      <section id="manifesto" className="relative min-h-[calc(100vh-140px)] scroll-mt-20 flex flex-col justify-center pb-12">
        {/* Background Image placed by the side of the name, bound to the full section height! */}
        <div 
          className="absolute right-0 top-0 bottom-0 pointer-events-none opacity-50 dark:opacity-30 md:opacity-70 dark:md:opacity-50 xl:translate-x-12 z-0 w-full md:w-[60%] lg:w-[50%]"
          style={{ WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 65% 40%, black 20%, transparent 100%)" }}
        >
          <div className="relative w-full h-full grayscale mix-blend-luminosity">
            {/* Dark Mode Hero */}
            <Image
              src="/hero.jpg"
              alt="Excel Ikueze Dark"
              fill
              priority
              className="object-cover object-center md:object-[center_top] hidden dark:block"
            />
            {/* Light (White) Mode Hero */}
            <Image
              src="/hero2.jpg"
              alt="Excel Ikueze Light"
              fill
              priority
              className="object-cover object-center md:object-[center_top] block dark:hidden"
            />
          </div>
        </div>

        <Reveal>
          <div className="mono mb-6 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] muted md:mb-10 pt-4 relative z-10 w-full">
            <p>P.001 / Manifesto</p>
            <p>Vol. 1 / 2026</p>
          </div>
        </Reveal>

        <Reveal delay={0.04}>
          <div className="hero-stack relative z-10">
            <h1 className="hero-name hero-name-top">EXCEL</h1>
            <h1 className="hero-name hero-name-bottom">IKUEZE</h1>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="mono max-w-2xl text-[11px] uppercase tracking-[0.2em] muted md:text-xs">
              Jack of all trades. Master of a few.
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
