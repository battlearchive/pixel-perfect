import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { listBattles } from "@/lib/battles.functions";
import { BattleCard } from "@/components/BattleCard";
import { WorldMap } from "@/components/WorldMap";
import { useAdminState } from "@/lib/admin-store";

const battlesQuery = queryOptions({
  queryKey: ["battles"],
  queryFn: () => listBattles(),
});

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Battle Archive",
  "url": "https://battlearchive.com",
  "description": "An illustrated atlas of the great battles of history — from Marathon to Midway. Maps, narratives, commanders and tactical analysis.",
  "author": {
    "@type": "Person",
    "name": "Senne"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://battlearchive.com/battles?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Battle Archive — Maps, Commanders & Timelines" },
      {
        name: "description",
        content:
          "An illustrated atlas of history's greatest battles — from Marathon to Midway. Maps, commanders and tactical analysis.",
      },
      { property: "og:title", content: "Battle Archive — History's Greatest Battles" },
      { property: "og:description", content: "An illustrated atlas of the great battles of history — from Marathon to Midway. Maps, narratives, and an interactive timeline of war." },
      { property: "og:image", content: "https://battlearchive.com/assets/b5_waterloo.jpg" },
      { property: "og:url", content: "https://battlearchive.com/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Battle Archive — History's Greatest Battles" },
      { name: "twitter:description", content: "An illustrated atlas of the great battles of history — from Marathon to Midway." },
    ],
    links: [
      { rel: "canonical", href: "https://battlearchive.com/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteJsonLd),
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(battlesQuery),
  component: Index,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-2xl">The archive is unreachable</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function Index() {
  const { data: battles } = useSuspenseQuery(battlesQuery);

  const { battles: adminBattles } = useAdminState();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const weekly = adminBattles.filter(
    (b) => typeof b.created_at === "number" && now - b.created_at < weekMs,
  );

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 -z-10">
          <img
            src="/assets/b5_waterloo.jpg"
            alt="Battle of Waterloo — the decisive engagement of June 1815"
            className="h-full w-full object-cover opacity-25"
            width={1280}
            height={768}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-16 sm:pt-32 sm:pb-28 text-center">
          <motion.img
            src="/assets/logo.png"
            alt="Battle Archive logo"
            className="mx-auto h-20 w-20 drop-shadow-[0_0_24px_rgba(201,168,76,0.5)]"
            width={80}
            height={80}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-8 font-display text-4xl sm:text-6xl tracking-tight"
          >
            BATTLE ARCHIVE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            An illustrated chronicle of {battles.length} battles that bent the arc of history —
            from the plain of Marathon to the carriers off Midway.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              to="/battles"
              className="rounded-sm border border-accent bg-accent px-6 py-3 text-xs uppercase tracking-[0.25em] font-semibold text-accent-foreground transition-all hover:shadow-[0_10px_30px_-10px_rgba(201,168,76,0.6)]"
            >
              Browse the archive
            </Link>
            <Link
              to="/timeline"
              className="rounded-sm border border-border px-6 py-3 text-xs uppercase tracking-[0.25em] text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              View timeline
            </Link>
          </motion.div>
        </div>
      </section>

      {/* WORLD MAP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-accent">Theatre of War</div>
            <h2 className="mt-2 font-display text-3xl tracking-tight">A world rewritten in blood</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Every marker is a battlefield. Click one to read the chronicle.
          </p>
        </div>
        <WorldMap battles={battles} />
      </section>

      {/* WEEKLY NEW BATTLES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20 sm:pb-24">
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-accent">Fresh from the archive</div>
            <h2 className="mt-2 font-display text-3xl tracking-tight">Weekly New Battles</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Newly added chronicles — featured here for seven days before they join the wider archive.
            </p>
          </div>
          <Link to="/battles" className="text-xs uppercase tracking-widest text-accent hover:underline">
            All {battles.length} →
          </Link>
        </div>
        {weekly.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {weekly.map((b, i) => (
              <BattleCard key={b.id} battle={b} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-border/60 bg-card/30 px-6 py-12 text-center">
            <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              No new battles this week
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Check back soon — fresh chronicles appear here as they're added.
            </p>
            <Link
              to="/battles"
              className="mt-5 inline-block rounded-sm border border-accent/60 px-5 py-2 text-xs uppercase tracking-[0.25em] text-accent hover:bg-accent/10"
            >
              Browse the full archive
            </Link>
          </div>
        )}
      </section>

      {/* SEO TEXT CONTENT */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-20 sm:pb-24 border-t border-border/40 pt-12 sm:pt-16">
        <div className="text-[10px] uppercase tracking-[0.4em] text-accent mb-3">About the archive</div>
        <h2 className="font-display text-3xl tracking-tight mb-8">History's Greatest Battles, Documented</h2>
        <div className="prose prose-invert max-w-none space-y-5 text-muted-foreground leading-relaxed">
          <p>
            Battle Archive documents the most decisive military engagements in world history — from the outnumbered Athenians who broke Persia's invasion at <Link to="/battles/marathon" className="text-accent hover:underline">Marathon</Link> in 490 BC, to the carrier battle off <Link to="/battles/midway" className="text-accent hover:underline">Midway Atoll</Link> in 1942 that turned the tide of the Pacific War. Each entry includes interactive maps, detailed commander profiles, force breakdowns, casualty figures, and a narrative that brings the action to life.
          </p>
          <p>
            The archive spans more than two and a half millennia of warfare. Ancient battles like <Link to="/battles/thermopylae" className="text-accent hover:underline">Thermopylae</Link> and <Link to="/battles/gaugamela" className="text-accent hover:underline">Gaugamela</Link> sit alongside medieval clashes such as <Link to="/battles/hastings" className="text-accent hover:underline">Hastings</Link> and <Link to="/battles/agincourt" className="text-accent hover:underline">Agincourt</Link>. The Napoleonic era is represented by <Link to="/battles/waterloo" className="text-accent hover:underline">Waterloo</Link>, <Link to="/battles/trafalgar" className="text-accent hover:underline">Trafalgar</Link>, and <Link to="/battles/borodino" className="text-accent hover:underline">Borodino</Link>. The industrial-scale slaughter of the First World War appears through the <Link to="/battles/somme" className="text-accent hover:underline">Somme</Link> and <Link to="/battles/verdun" className="text-accent hover:underline">Verdun</Link>, while the Second World War is chronicled through <Link to="/battles/stalingrad" className="text-accent hover:underline">Stalingrad</Link>, <Link to="/battles/kursk" className="text-accent hover:underline">Kursk</Link>, and <Link to="/battles/d-day" className="text-accent hover:underline">D-Day</Link>.
          </p>
          <p>
            Every battle page features the tactical context — why generals made the decisions they did, what terrain shaped the fighting, and what the outcome meant for the centuries that followed. The <Link to="/timeline" className="text-accent hover:underline">interactive timeline</Link> lets you sweep through all {battles.length} battles at once, colour-coded by era from ancient to modern.
          </p>
        </div>

        {/* Era quick-links */}
        <div className="mt-12">
          <div className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4">Browse by era</div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Ancient", href: "/battles", filter: "ancient" },
              { label: "Medieval", href: "/battles", filter: "medieval" },
              { label: "Napoleonic", href: "/battles", filter: "napoleonic" },
              { label: "Great War", href: "/battles", filter: "ww1" },
              { label: "World War II", href: "/battles", filter: "ww2" },
            ].map((era) => (
              <Link
                key={era.filter}
                to={era.href}
                className="rounded-sm border border-border/60 px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {era.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
