import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { Battle } from "@/lib/battles.types";

const Inner = lazy(() => import("./WorldMap.client"));

export function WorldMap({ battles }: { battles: Battle[] }) {
  return (
    <ClientOnly fallback={<div className="h-[480px] w-full rounded-sm border border-border/50 bg-card/30 grid place-items-center text-xs uppercase tracking-widest text-muted-foreground">Loading atlas…</div>}>
      <Suspense fallback={<div className="h-[480px] w-full rounded-sm border border-border/50 bg-card/30" />}>
        <Inner battles={battles} />
      </Suspense>
    </ClientOnly>
  );
}