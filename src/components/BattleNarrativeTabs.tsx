import { useState } from "react";
import type { Battle } from "@/lib/battles.types";
import { cn } from "@/lib/utils";

type TabKey = "background" | "course" | "turning_points" | "aftermath";

const TAB_LABELS: Record<TabKey, string> = {
  background: "Background",
  course: "Course of Battle",
  turning_points: "Turning Points",
  aftermath: "Aftermath",
};

export function BattleNarrativeTabs({ battle }: { battle: Battle }) {
  const sections: Partial<Record<TabKey, string>> = {
    background: battle.background ?? undefined,
    course: battle.course ?? undefined,
    turning_points: battle.turning_points ?? undefined,
    aftermath: battle.aftermath ?? undefined,
  };
  const available = (Object.keys(TAB_LABELS) as TabKey[]).filter(
    (k) => (sections[k] ?? "").trim().length > 0,
  );

  const [active, setActive] = useState<TabKey | null>(available[0] ?? null);

  // No structured sections → fall back to single narrative
  if (available.length === 0) {
    return (
      <div
        className="text-foreground/90 leading-[1.95] text-[17px] whitespace-pre-line"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {battle.narrative}
      </div>
    );
  }

  return (
    <div>
      <div
        role="tablist"
        className="flex flex-wrap gap-1 border-b border-border/40 mb-6"
      >
        {available.map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={active === k}
            onClick={() => setActive(k)}
            className={cn(
              "px-4 py-2.5 text-[11px] uppercase tracking-[0.25em] font-semibold transition-colors -mb-px border-b-2",
              active === k
                ? "text-accent border-accent"
                : "text-muted-foreground border-transparent hover:text-foreground",
            )}
          >
            {TAB_LABELS[k]}
          </button>
        ))}
      </div>
      <div
        key={active ?? "none"}
        className="text-foreground/90 leading-[1.95] text-[17px] whitespace-pre-line animate-in fade-in duration-300"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {active ? sections[active] : null}
      </div>
    </div>
  );
}