import { createServerFn } from "@tanstack/react-start";
import { assertSupabaseAdmin } from "./admin-auth.functions";

// ---------- Battles ----------
export const upsertBattleDb = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      id: string;
      slug: string;
      name: string;
      year: number;
      era: string;
      region: string;
      location: string;
      lat: number;
      lng: number;
      commanders: unknown;
      forces: unknown;
      casualties: unknown;
      outcome: string;
      hero_image: string;
      summary: string;
      narrative: string;
      background?: string | null;
      course?: string | null;
      turning_points?: string | null;
      aftermath?: string | null;
      fun_fact?: string | null;
      created_at?: number;
    }) => data,
  )
  .handler(async ({ data }) => {
    await assertSupabaseAdmin();
    const { supabaseAdmin } = await import("./supabase.server");
    const row = {
      id: data.id,
      slug: data.slug,
      name: data.name,
      year: data.year,
      era: data.era,
      region: data.region,
      location: data.location,
      lat: data.lat,
      lng: data.lng,
      commanders: data.commanders ?? [],
      forces: data.forces ?? {},
      casualties: data.casualties ?? {},
      outcome: data.outcome,
      hero_image: data.hero_image,
      summary: data.summary,
      narrative: data.narrative,
      background: data.background ?? null,
      course: data.course ?? null,
      turning_points: data.turning_points ?? null,
      aftermath: data.aftermath ?? null,
      fun_fact: data.fun_fact ?? null,
      ...(data.created_at
        ? { created_at: new Date(data.created_at).toISOString() }
        : {}),
    };
    const { error } = await supabaseAdmin.from("battles").upsert(row, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteBattleDb = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await assertSupabaseAdmin();
    const { supabaseAdmin } = await import("./supabase.server");
    const { error } = await supabaseAdmin.from("battles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------- Quizzes ----------
export const addQuizDb = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      battle_id: string;
      kind: "mc" | "tf" | "open";
      question: string;
      options: string[];
      correct_index: number;
      explanation: string | null;
    }) => data,
  )
  .handler(async ({ data }) => {
    await assertSupabaseAdmin();
    const { supabaseAdmin } = await import("./supabase.server");
    const id = `q_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const { error } = await supabaseAdmin.from("battle_quizzes").insert({ id, ...data });
    if (error) throw new Error(error.message);
    return { ok: true as const, id };
  });

export const deleteQuizDb = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await assertSupabaseAdmin();
    const { supabaseAdmin } = await import("./supabase.server");
    const { error } = await supabaseAdmin.from("battle_quizzes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------- Gallery ----------
export const addImageDb = createServerFn({ method: "POST" })
  .inputValidator((data: { battle_id: string; url: string }) => data)
  .handler(async ({ data }) => {
    await assertSupabaseAdmin();
    const { supabaseAdmin } = await import("./supabase.server");
    const id = `i_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const { error } = await supabaseAdmin.from("battle_gallery").insert({ id, ...data });
    if (error) throw new Error(error.message);
    return { ok: true as const, id };
  });

export const deleteImageDb = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await assertSupabaseAdmin();
    const { supabaseAdmin } = await import("./supabase.server");
    const { error } = await supabaseAdmin.from("battle_gallery").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
