import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getBattle, listBattles } from "@/lib/battles.functions";
import { ERAS, formatYear } from "@/lib/battles.types";
import { TacticalMap } from "@/components/TacticalMap";
import { BattleNarrativeTabs } from "@/components/BattleNarrativeTabs";
import { BattleQuiz } from "@/components/BattleQuiz";
import { BattleGallery } from "@/components/BattleGallery";
import { useAdminState } from "@/lib/admin-store";

const battleQuery = (slug: string) =>
  queryOptions({
    queryKey: ["battle", slug],
    queryFn: () => getBattle({ data: { slug } }),
  });

const allBattlesQuery = queryOptions({
  queryKey: ["battles"],
  queryFn: () => listBattles(),
});

function buildArticleJsonLd(battle: NonNullable<Awaited<ReturnType<typeof getBattle>>>) {
  const yearStr = battle.year < 0 ? `${Math.abs(battle.year)} BC` : `${battle.year} AD`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${battle.name} (${yearStr}) — History, Map, Commanders & Outcome`,
    "description": battle.summary,
    "image": battle.hero_image.startsWith("http")
      ? battle.hero_image
      : `https://battlearchive.com${battle.hero_image}`,
    "author": {
      "@type": "Person",
      "name": "Senne"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Battle Archive",
      "url": "https://battlearchive.com"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://battlearchive.com/battles/${battle.slug}`
    },
    "about": {
      "@type": "Event",
      "name": battle.name,
      "description": battle.summary,
      "location": {
        "@type": "Place",
        "name": battle.location,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": battle.lat,
          "longitude": battle.lng
        }
      },
      "startDate": battle.year < 0
        ? `-${String(Math.abs(battle.year)).padStart(4, "0")}`
        : String(battle.year),
      "organizer": battle.commanders.map((c) => ({
        "@type": "Person",
        "name": c.name,
        "jobTitle": c.role
      }))
    }
  };
}

export const Route = createFileRoute("/battles/$slug")({
  loader: async ({ context, params }) => {
    const battle = await context.queryClient.ensureQueryData(battleQuery(params.slug));
    if (!battle) throw notFound();
    await context.queryClient.ensureQueryData(allBattlesQuery);
    return battle;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Battle — Battle Archive" }] };
    const yearStr = loaderData.year < 0
      ? `${Math.abs(loaderData.year)} BC`
      : `${loaderData.year} AD`;
    const imageUrl = loaderData.hero_image.startsWith("http")
      ? loaderData.hero_image
      : `https://battlearchive.com${loaderData.hero_image}`;
    return {
      meta: [
        {
          title: `${loaderData.name} (${yearStr}) | History, Map, Commanders & Outcome — Battle Archive`,
        },
        { name: "description", content: loaderData.summary },
        {
          property: "og:title",
          content: `${loaderData.name} (${yearStr}) | Battle Archive`,
        },
        { property: "og:description", content: loaderData.summary },
        { property: "og:image", content: imageUrl },
        { property: "og:type", content: "article" },
        {
          property: "og:url",
          content: `https://battlearchive.com/battles/${loaderData.slug}`,
        },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: `${loaderData.name} (${yearStr}) | Battle Archive`,
        },
        { name: "twitter:description", content: loaderData.summary },
        { name: "twitter:image", content: imageUrl },
      ],
      links: [
        {
          rel: "canonical",
          href: `https://battlearchive.com/battles/${loaderData.slug}`,
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(buildArticleJsonLd(loaderData)),
        },
      ],
    };
  },
  component: BattleDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl">Battle not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">This chronicle is not in the vault.</p>
      <Link to="/battles" className="mt-6 inline-block text-xs uppercase tracking-widest text-accent">
        Back to archive →
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-2xl">Couldn't load chronicle</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function BattleDetail() {
  const { slug } = Route.useParams();
  const { data: serverBattle } = useSuspenseQuery(battleQuery(slug));
  const { data: allBattles } = useSuspenseQuery(allBattlesQuery);
  const { battles: adminBattles } = useAdminState();
  const adminBattle = adminBattles.find((b) => b.slug === slug);
  const battle = (adminBattle ?? serverBattle) as typeof serverBattle | null;
  if (!battle) return null;
  const era = ERAS[battle.era];
  const yearStr = battle.year < 0
    ? `${Math.abs(battle.year)} BC`
    : `${battle.year} AD`;

  // Related battles: same era (excluding current), max 3
  const relatedBattles = (allBattles ?? [])
    .filter((b) => b.era === battle.era && b.slug !== battle.slug)
    .slice(0, 3);

  // Same region (excluding current & already shown), max 2
  const regionBattles = (allBattles ?? [])
    .filter(
      (b) =>
        b.region === battle.region &&
        b.slug !== battle.slug &&
        !relatedBattles.find((r) => r.slug === b.slug),
    )
    .slice(0, 2);

  return (
    <article className="pb-24">
      {/* HERO */}
      <header className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 -z-10">
          <img
            src={battle.hero_image}
            alt={`${battle.name} — ${battle.location}, ${yearStr}`}
            className="h-full w-full object-cover opacity-40"
            width={1280}
            height={768}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16 text-center">
          <div
            className="inline-block px-3 py-1 text-[10px] uppercase tracking-[0.3em] font-semibold rounded-sm mb-6"
            style={{ backgroundColor: `${era?.color}33`, color: era?.color, border: `1px solid ${era?.color}66` }}
          >
            {era?.label} · {formatYear(battle.year)}
          </div>
          <h1 className="font-display text-4xl sm:text-6xl tracking-tight">{battle.name}</h1>
          <p className="mt-4 text-base text-muted-foreground">{battle.location}</p>
          <p className="mx-auto mt-8 max-w-3xl text-lg italic text-foreground/90 leading-relaxed">
            {battle.summary}
          </p>
        </div>
      </header>

      {/* HERO IMAGE */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 -mt-2 sm:-mt-4">
        <img
          src={battle.hero_image}
          alt={`Map and scene of the ${battle.name}, ${yearStr}, ${battle.location}`}
          width={1280}
          height={768}
          loading="lazy"
          className="w-full rounded-sm border border-border/50 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
        />
      </div>

      {/* STATS GRID */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-12 sm:mt-16 grid gap-4 sm:gap-6 md:grid-cols-3" aria-label="Battle statistics">
        <StatCard label="Outcome" value={battle.outcome} />
        <StatCard
          label="Commanders"
          value={
            <ul className="space-y-1">
              {battle.commanders.map((c) => (
                <li key={c.name}>
                  <span className="text-accent">{c.name}</span>{" "}
                  <span className="text-muted-foreground">— {c.side}</span>
                </li>
              ))}
            </ul>
          }
        />
        <StatCard
          label="Forces engaged"
          value={
            <ul className="space-y-1">
              {Object.entries(battle.forces).map(([k, v]) => (
                <li key={k} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-mono text-accent">{v.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          }
        />
        <StatCard
          label="Casualties"
          value={
            <ul className="space-y-1">
              {Object.entries(battle.casualties).map(([k, v]) => (
                <li key={k} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-mono text-destructive">{v.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          }
        />
        <StatCard label="Region" value={battle.region} />
        <StatCard label="Coordinates" value={`${battle.lat.toFixed(3)}, ${battle.lng.toFixed(3)}`} />
      </section>

      {/* NARRATIVE */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 mt-12 sm:mt-16">
        <div className="text-[10px] uppercase tracking-[0.4em] text-accent mb-3">Chronicle</div>
        <h2 className="font-display text-2xl mb-6">What happened</h2>
        <BattleNarrativeTabs battle={battle} />
      </section>

      {/* MAP */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-12 sm:mt-16">
        <div className="text-[10px] uppercase tracking-[0.4em] text-accent mb-3">The Ground</div>
        <h2 className="font-display text-2xl mb-6">Where it was fought</h2>
        <TacticalMap battle={battle} />
      </section>

      {/* GALLERY */}
      <BattleGallery battleId={battle.id} />

      {/* QUIZ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 mt-12 sm:mt-16">
        <BattleQuiz battleId={battle.id} />
      </section>

      {/* RELATED BATTLES — internal links */}
      {(relatedBattles.length > 0 || regionBattles.length > 0) && (
        <section className="mx-auto max-w-3xl px-4 sm:px-6 mt-12 sm:mt-16 border-t border-border/40 pt-10 sm:pt-12">
          <div className="text-[10px] uppercase tracking-[0.4em] text-accent mb-3">Explore more</div>
          <h2 className="font-display text-2xl mb-6">Related battles</h2>
          <div className="space-y-4">
            {relatedBattles.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Same era — {era?.label}
                </p>
                <ul className="space-y-2">
                  {relatedBattles.map((b) => (
                    <li key={b.slug}>
                      <Link
                        to="/battles/$slug"
                        params={{ slug: b.slug }}
                        className="flex items-center gap-3 rounded-sm border border-border/40 bg-card/40 px-4 py-3 text-sm transition-colors hover:border-accent/50 hover:bg-card/80"
                      >
                        <span className="text-accent font-display truncate min-w-0">{b.name}</span>
                        <span className="text-muted-foreground text-xs ml-auto shrink-0">
                          {formatYear(b.year)} · {b.location}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {regionBattles.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Same region — {battle.region}
                </p>
                <ul className="space-y-2">
                  {regionBattles.map((b) => (
                    <li key={b.slug}>
                      <Link
                        to="/battles/$slug"
                        params={{ slug: b.slug }}
                        className="flex items-center gap-3 rounded-sm border border-border/40 bg-card/40 px-4 py-3 text-sm transition-colors hover:border-accent/50 hover:bg-card/80"
                      >
                        <span className="text-accent font-display truncate min-w-0">{b.name}</span>
                        <span className="text-muted-foreground text-xs ml-auto shrink-0">
                          {formatYear(b.year)} · {ERAS[b.era]?.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-3xl px-4 sm:px-6 mt-10 sm:mt-12 text-center">
        <Link to="/battles" className="text-xs uppercase tracking-widest text-accent hover:underline">
          ← Back to archive
        </Link>
      </div>
    </article>
  );
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-border/60 bg-card/60 p-5">
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">{label}</div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}
