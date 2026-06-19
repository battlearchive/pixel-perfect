import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { Battle } from "@/lib/battles.types";

const Inner = lazy(() => import("./TacticalMap.client"));

export function TacticalMap({ battle }: { battle: Battle }) {
  return (
    <ClientOnly fallback={<div className="h-[420px] w-full rounded-sm border border-border/50 bg-card/30" />}>
      <Suspense fallback={<div className="h-[420px] w-full rounded-sm border border-border/50 bg-card/30" />}>
        <Inner battle={battle} />
      </Suspense>
    </ClientOnly>
  );
}