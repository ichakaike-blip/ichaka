import { Reveal } from "@/components/reveal";

const socialLinks = [
  { label: "X (Twitter)", href: "https://x.com/" },
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
];

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-8">
      <Reveal>
        <h1 className="text-3xl font-semibold md:text-4xl">Contact</h1>
      </Reveal>

      <Reveal delay={0.05}>
        <p className="muted">Send me a message if you want my services.</p>
      </Reveal>

      <Reveal delay={0.1}>
        <form className="card space-y-4 border-black/10 dark:border-white/10">
          <input
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-cyan-400/40 focus:ring-4 dark:border-white/10 dark:bg-zinc-900"
            placeholder="Name"
            name="name"
          />
          <input
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-cyan-400/40 focus:ring-4 dark:border-white/10 dark:bg-zinc-900"
            placeholder="Email"
            name="email"
            type="email"
          />
          <textarea
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-cyan-400/40 focus:ring-4 dark:border-white/10 dark:bg-zinc-900"
            placeholder="Your message"
            name="message"
            rows={6}
          />
          <button
            type="submit"
            className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300"
          >
            Send message
          </button>
        </form>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="flex flex-wrap gap-2">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full border border-black/10 px-4 py-2 text-sm transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
