import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listBattles } from "../lib/battles.functions";

// ── Era metadata ──────────────────────────────────────────────────────────────
const ERA_ORDER = [
  "ancient",
  "medieval",
  "early_modern",
  "napoleonic",
  "modern",
  "ww1",
  "ww2",
] as const;

const ERA_LABELS: Record<string, string> = {
  ancient:      "Ancient",
  medieval:     "Medieval",
  "early_modern": "Early Modern",
  napoleonic:   "Napoleonic",
  modern:       "Modern",
  ww1:          "World War I",
  ww2:          "World War II",
};

type BattleStub = { slug: string; name: string; era: string };

function groupByEra(battles: BattleStub[]) {
  const map = new Map<string, BattleStub[]>();
  for (const era of ERA_ORDER) map.set(era, []);
  for (const b of battles) {
    if (!map.has(b.era)) map.set(b.era, []);
    map.get(b.era)!.push(b);
  }
  for (const [era, list] of map) {
    if (list.length === 0) map.delete(era);
  }
  return map;
}

// ── Collapsible era column (accordion on mobile, always open on desktop) ─────
function EraColumn({ era, battles }: { era: string; battles: BattleStub[] }) {
  const [open, setOpen] = useState(false);
  const label = ERA_LABELS[era] ?? era;

  return (
    <div className="border-b border-border/30 sm:border-none last:border-none text-xs text-muted-foreground">
      <button
        type="button"
        className="w-full flex items-center justify-between py-3 sm:py-0 sm:cursor-default sm:pointer-events-none"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-accent sm:mb-3 block">
          {label}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform sm:hidden ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <ul
        className={`overflow-hidden transition-all duration-200 ease-in-out space-y-0.5 sm:space-y-2 sm:mt-0 sm:!max-h-none sm:!opacity-100 ${
          open
            ? "max-h-[600px] opacity-100 pb-3"
            : "max-h-0 opacity-0 sm:max-h-none sm:opacity-100"
        }`}
      >
        {battles.map((b) => (
          <li key={b.slug}>
            <Link
              to="/battles/$slug"
              params={{ slug: b.slug }}
              className="hover:text-accent transition-colors inline-block py-1 leading-snug"
            >
              {b.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
export function SiteFooter() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: battles = [] } = useQuery({
    queryKey: ["battles"],
    queryFn: () => listBattles(),
    staleTime: 5 * 60 * 1000,
    enabled: mounted,
  });

  const grouped = groupByEra(battles);
  const eraEntries = mounted ? [...grouped.entries()] : [];
  const colCount = eraEntries.length + 1;

  return (
    <footer className="mt-24 border-t border-border/40 bg-card/40" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">

        {/* Top grid: navigate + era columns */}
        <div
          className="flex flex-col sm:grid gap-x-6 gap-y-0 mb-8 sm:mb-10"
          style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
        >

          {/* Navigate — always expanded */}
          <div className="border-b border-border/30 sm:border-none py-3 sm:py-0">
            <div className="text-[10px] uppercase tracking-[0.3em] text-accent sm:mb-3">Navigate</div>
            <ul className="space-y-0.5 sm:space-y-2 text-xs text-muted-foreground mt-1 sm:mt-0">
              <li><Link to="/" className="hover:text-accent transition-colors inline-block py-1">Home</Link></li>
              <li><Link to="/battles" className="hover:text-accent transition-colors inline-block py-1">All Battles</Link></li>
              <li><Link to="/timeline" className="hover:text-accent transition-colors inline-block py-1">Timeline</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors inline-block py-1">About</Link></li>
            </ul>
          </div>

          {/* Era columns — fully dynamic from Supabase/data */}
          {eraEntries.map(([era, list]) => (
            <EraColumn key={era} era={era} battles={list} />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo.png"
              alt="Battle Archive logo"
              className="h-8 w-8 opacity-80"
              width={32}
              height={32}
            />
            <div className="tracking-widest uppercase text-center sm:text-left">
              Battle Archive · Chronicles of War
            </div>
          </div>
          <div className="tracking-wider text-center sm:text-right">
            © {new Date().getFullYear()} · Compiled from open historical sources.
          </div>
        </div>
      </div>
    </footer>
  );
}
