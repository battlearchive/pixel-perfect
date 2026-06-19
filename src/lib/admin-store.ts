import { useEffect, useSyncExternalStore } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import { BATTLES } from "./battles.data";
import type { Battle } from "./battles.types";
import {
  upsertBattleDb,
  deleteBattleDb,
  addQuizDb,
  deleteQuizDb,
  addImageDb,
  deleteImageDb,
} from "./admin-db.functions";

export type AdminQuiz = {
  id: string;
  battle_id: string;
  kind: "mc" | "tf" | "open";
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
};

export type AdminBattle = Battle & { fun_fact?: string; created_at?: number };

export type GalleryImage = { id: string; url: string };

export type AdminState = {
  battles: AdminBattle[];
  quizzes: Record<string, AdminQuiz[]>;
  gallery: Record<string, GalleryImage[]>;
  loaded: boolean;
};

function emptyState(): AdminState {
  // Static seed used only when Supabase is NOT configured (so the UI still
  // renders something during local dev before the .env is filled in).
  if (!isSupabaseConfigured) {
    return {
      battles: BATTLES.map((b) => ({ ...b })) as AdminBattle[],
      quizzes: {},
      gallery: {},
      loaded: true,
    };
  }
  return { battles: [], quizzes: {}, gallery: {}, loaded: false };
}

let state: AdminState = emptyState();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function commit(next: AdminState) {
  state = next;
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const getSnapshot = () => state;

let loading: Promise<void> | null = null;

export function refreshAdminState(): Promise<void> {
  if (!supabase) return Promise.resolve();
  if (loading) return loading;
  loading = (async () => {
    const [bRes, qRes, gRes] = await Promise.all([
      supabase!.from("battles").select("*").order("year", { ascending: true }),
      supabase!.from("battle_quizzes").select("*").order("created_at", { ascending: true }),
      supabase!.from("battle_gallery").select("*").order("created_at", { ascending: true }),
    ]);
    if (bRes.error) throw new Error(bRes.error.message);
    if (qRes.error) throw new Error(qRes.error.message);
    if (gRes.error) throw new Error(gRes.error.message);

    const battles = (bRes.data ?? []).map((r): AdminBattle => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      year: r.year,
      era: r.era,
      region: r.region,
      location: r.location,
      lat: Number(r.lat),
      lng: Number(r.lng),
      commanders: r.commanders ?? [],
      forces: r.forces ?? {},
      casualties: r.casualties ?? {},
      outcome: r.outcome,
      hero_image: r.hero_image,
      summary: r.summary,
      narrative: r.narrative,
      background: r.background,
      course: r.course,
      turning_points: r.turning_points,
      aftermath: r.aftermath,
      fun_fact: r.fun_fact ?? "",
      created_at: r.created_at ? new Date(r.created_at).getTime() : undefined,
    }));

    const quizzes: Record<string, AdminQuiz[]> = {};
    for (const row of qRes.data ?? []) {
      const q: AdminQuiz = {
        id: row.id,
        battle_id: row.battle_id,
        kind: row.kind,
        question: row.question,
        options: row.options ?? [],
        correct_index: row.correct_index ?? 0,
        explanation: row.explanation,
      };
      (quizzes[q.battle_id] ??= []).push(q);
    }

    const gallery: Record<string, GalleryImage[]> = {};
    for (const row of gRes.data ?? []) {
      (gallery[row.battle_id] ??= []).push({ id: row.id, url: row.url });
    }

    commit({ battles, quizzes, gallery, loaded: true });
  })().finally(() => {
    loading = null;
  });
  return loading;
}

export function useAdminState(): AdminState {
  const s = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  useEffect(() => {
    if (isSupabaseConfigured && !s.loaded) {
      refreshAdminState().catch((e) => console.error("[admin-store] load failed", e));
    }
  }, [s.loaded]);
  return s;
}

export const adminActions = {
  async upsertBattle(b: AdminBattle) {
    if (!isSupabaseConfigured) {
      const idx = state.battles.findIndex((x) => x.id === b.id);
      const battles =
        idx >= 0 ? state.battles.map((x) => (x.id === b.id ? b : x)) : [...state.battles, b];
      commit({ ...state, battles });
      return;
    }
    await upsertBattleDb({ data: b });
    await refreshAdminState();
  },
  async deleteBattle(id: string) {
    if (!isSupabaseConfigured) {
      const quizzes = { ...state.quizzes };
      delete quizzes[id];
      const gallery = { ...state.gallery };
      delete gallery[id];
      commit({
        ...state,
        battles: state.battles.filter((b) => b.id !== id),
        quizzes,
        gallery,
      });
      return;
    }
    await deleteBattleDb({ data: { id } });
    await refreshAdminState();
  },
  async addQuiz(battleId: string, q: Omit<AdminQuiz, "id" | "battle_id">) {
    if (!isSupabaseConfigured) {
      const full: AdminQuiz = {
        ...q,
        id: `q_${Date.now()}_${Math.random()}`,
        battle_id: battleId,
      };
      commit({
        ...state,
        quizzes: { ...state.quizzes, [battleId]: [...(state.quizzes[battleId] ?? []), full] },
      });
      return;
    }
    await addQuizDb({ data: { battle_id: battleId, ...q } });
    await refreshAdminState();
  },
  async deleteQuiz(battleId: string, qid: string) {
    if (!isSupabaseConfigured) {
      commit({
        ...state,
        quizzes: {
          ...state.quizzes,
          [battleId]: (state.quizzes[battleId] ?? []).filter((q) => q.id !== qid),
        },
      });
      return;
    }
    await deleteQuizDb({ data: { id: qid } });
    await refreshAdminState();
  },
  async addImage(battleId: string, url: string) {
    if (!isSupabaseConfigured) {
      const img: GalleryImage = { id: `i_${Date.now()}_${Math.random()}`, url };
      commit({
        ...state,
        gallery: { ...state.gallery, [battleId]: [...(state.gallery[battleId] ?? []), img] },
      });
      return;
    }
    await addImageDb({ data: { battle_id: battleId, url } });
    await refreshAdminState();
  },
  async deleteImage(battleId: string, imgId: string) {
    if (!isSupabaseConfigured) {
      commit({
        ...state,
        gallery: {
          ...state.gallery,
          [battleId]: (state.gallery[battleId] ?? []).filter((i) => i.id !== imgId),
        },
      });
      return;
    }
    await deleteImageDb({ data: { id: imgId } });
    await refreshAdminState();
  },
};

export function newBlankBattle(): AdminBattle {
  const id = `b_${Date.now()}`;
  return {
    id,
    slug: "",
    name: "",
    year: 0,
    era: "ancient",
    region: "",
    location: "",
    lat: 0,
    lng: 0,
    commanders: [],
    forces: {},
    casualties: {},
    outcome: "",
    hero_image: "",
    summary: "",
    narrative: "",
    background: "",
    course: "",
    turning_points: "",
    aftermath: "",
    fun_fact: "",
    created_at: Date.now(),
  };
}
