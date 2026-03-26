import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About | ichaka",
  description: "About Ikueze Excel Ikenna, also known as Ichaka.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-5 text-base leading-8 md:text-lg">
      <Reveal>
        <h1 className="text-3xl font-semibold md:text-4xl">About Me</h1>
      </Reveal>

      <Reveal delay={0.05}>
        <p>
          Hi, my name is Ikueze Excel Ikenna, also known as Ichaka. I like to see myself as a
          jack of all trades, but in this case, I have indeed mastered a few.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <p>
          I am an enthusiast for AI-related technology, an avidly curious person, I love movies,
          and I like reading. In as much as I do not love work, I am very excited to start every
          new project, getting my high from obsessing over the finished product. I am a
          perfectionist, albeit being imperfect myself.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <p>
          I am not one to toot my own horn, but I will regardless: I have an incredible work
          ethic, and I am oddly efficient.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <p>
          It is super crazy how efficient I can become, especially when I am motivated by money.
          Oh, money, I do love that. Like, a lot. I do not have enough though, so that tells you
          that I will not mess up my chances of making more. If you eventually hire me, money is a
          good enough incentive for me to meet every deliverable that might pop up in the course of
          my employment.
        </p>
      </Reveal>
    </article>
  );
}
