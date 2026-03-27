import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import ContactForm from "../../components/contact-form";

export const metadata: Metadata = {
  title: "Contact | ichaka",
  description: "Get in touch with Ichaka for projects and collaborations.",
};

const socialLinks = [
  { label: "X (Twitter)", href: "https://x.com/web3watch4l2" },
  { label: "GitHub", href: "https://github.com/ichakaike-blip" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ikueze-excel-68aa64361/" },
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
        <ContactForm />
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
