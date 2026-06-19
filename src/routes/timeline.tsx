import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listBattles } from "@/lib/battles.functions";
import { Timeline } from "@/components/Timeline";
import { ERAS } from "@/lib/battles.types";

const battlesQuery = queryOptions({
  queryKey: ["battles"],
  queryFn: () => listBattles(),
});

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Battle Timeline — 2,500 Years of War | Battle Archive" },
      {
        name: "description",
        content:
          "Interactive timeline of decisive battles from 490 BC to 1945. Color-coded by era from Ancient to WW2.",
      },
      { property: "og:title", content: "Battle Timeline — 2,500 Years of War | Battle Archive" },
      { property: "og:description", content: "Interactive timeline of decisive battles from Marathon to Midway, spanning 2,500 years of warfare." },
      { property: "og:url", content: "https://battlearchive.com/timeline" },
    ],
    links: [
      { rel: "canonical", href: "https://battlearchive.com/timeline" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(battlesQuery),
  component: TimelinePage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-2xl">Timeline unavailable</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function TimelinePage() {
  const { data: battles } = useSuspenseQuery(battlesQuery);
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-16 pb-6 sm:pb-8">
        <div className="text-[10px] uppercase tracking-[0.4em] text-accent">2,500 years of war</div>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Timeline</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Scroll sideways through history. Each card is a battle — click to read the chronicle. Era bands stretch
          where time was densely contested.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.2em]">
          {Object.entries(ERAS).map(([key, e]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="h-2 w-4" style={{ background: e.color }} />
              <span className="text-muted-foreground">{e.label}</span>
            </div>
          ))}
        </div>
      </div>
      <Timeline battles={battles} />
      <div className="mx-auto max-w-7xl px-6 py-8 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        ← drag or scroll horizontally →
      </div>
    </div>
  );
}