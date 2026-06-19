import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Battle Archive — A Teen's Illustrated History of War" },
      { name: "description", content: "Battle Archive is a personal illustrated atlas of history's greatest battles, written by a teenager obsessed with military history. Maps, narratives, commanders and tactical analysis from Marathon to Midway." },
      { property: "og:title", content: "About Battle Archive" },
      { property: "og:description", content: "Battle Archive is a personal illustrated atlas of history's greatest battles — written by a teenager obsessed with military history." },
      { property: "og:url", content: "https://battlearchive.com/about" },
    ],
    links: [
      { rel: "canonical", href: "https://battlearchive.com/about" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
      <div className="text-[10px] uppercase tracking-[0.4em] text-accent">About</div>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Hi, I'm Senne</h1>

      <div
        className="mt-8 space-y-6 text-[17px] leading-[1.9]"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        <p>
          I'm a teenager who likes to learn about history, especially military history. However, I have always found that most history sites are just plain text with no clear insights, which is why I started Battle Archive.
        </p>
        <p>
          <strong>Battle Archive</strong> is an illustrated atlas of the
          engagements I find most fascinating — from Marathon to Midway — with maps,
          commanders, force estimates, and the narrative behind each fight. You can sweep
          through the{" "}
          <Link to="/timeline" className="text-accent hover:underline">
            timeline
          </Link>
          , browse the{" "}
          <Link to="/battles" className="text-accent hover:underline">
            full archive
          </Link>
          , or just click around on the world map.
        </p>
        <p>
          I write everything myself, mostly on the weekends or whenever I have the time. I am by no means a professional, but I always try to be as accurate as possible since I don't want to spread fake information. This site is still being developed, and I would love to hear your feedback or suggestions. You can contact me at{" "}
          <a href="mailto:battlearchive.net@gmail.com" className="text-accent hover:underline">battlearchive.net@gmail.com</a>{" "}
          so we can all make this site a better place for historians.
        </p>
        <p className="rounded-sm border border-accent/30 bg-accent/5 p-5 text-[15px] not-italic">
          <strong className="text-accent">A small warning.</strong> This site is a personal project, so there will probably be minor mistakes—wrong dates, slightly off numbers, or the occasional misattributed quote. If you find such a mistake, feel free to email me about it at{" "}
          <a href="mailto:battlearchive.net@gmail.com" className="text-accent hover:underline">battlearchive.net@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}