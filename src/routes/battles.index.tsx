import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { listBattles } from "@/lib/battles.functions";
import { BattleCard } from "@/components/BattleCard";
import { ERAS } from "@/lib/battles.types";

const battlesQuery = queryOptions({
  queryKey: ["battles"],
  queryFn: () => listBattles(),
});

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://battlearchive.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "All Battles",
      "item": "https://battlearchive.com/battles"
    }
  ]
};

export const Route = createFileRoute("/battles/")({
  head: () => ({
    meta: [
      { title: "All Battles — Battle Archive" },
      {
        name: "description",
        content:
          "Browse every battle from Marathon to Midway. Filter by era, explore maps, commanders and tactical analysis.",
      },
      { property: "og:title", content: "All Battles — Battle Archive" },
      { property: "og:description", content: "Every decisive battle in history, filterable by era. Interactive maps, commander profiles and tactical narratives." },
      { property: "og:url", content: "https://battlearchive.com/battles" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://battlearchive.com/battles" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbJsonLd),
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(battlesQuery),
  component: BattlesIndex,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-2xl">Archive unavailable</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function BattlesIndex() {
  const { data: battles } = useSuspenseQuery(battlesQuery);
  const [era, setEra] = useState<string | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = era === "all" ? battles : battles.filter((b) => b.era === era);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) =>
        b.name.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.region.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q) ||
        b.commanders.some((c) => c.name.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [battles, era, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-10">
        <div className="text-[10px] uppercase tracking-[0.4em] text-accent">The archive</div>
        <h1 className="mt-2 font-display text-4xl tracking-tight">All Battles</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {battles.length} chronicles spanning from 490 BC to the modern era — maps, commanders,
          forces and tactical analysis for every engagement. Filter by era below.
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="battle-search" className="sr-only">Search battles, locations, commanders</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="battle-search"
            type="search"
            placeholder="Search battles, locations, commanders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-transparent pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter by era">
        <FilterChip active={era === "all"} onClick={() => setEra("all")} label="All" color="#c9a84c" />
        {Object.entries(ERAS).map(([key, e]) => (
          <FilterChip
            key={key}
            active={era === key}
            onClick={() => setEra(key)}
            label={e.label}
            color={e.color}
          />
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b, i) => (
          <BattleCard key={b.id} battle={b} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          No battles match your search.
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="rounded-sm border px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] transition-all cursor-pointer"
      style={{
        borderColor: active ? color : "var(--color-border)",
        background: active ? `${color}22` : "transparent",
        color: active ? color : "var(--color-muted-foreground)",
      }}
    >
      {label}
    </button>
  );
}
