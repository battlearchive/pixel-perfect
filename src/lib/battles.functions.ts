import type { Battle } from "./battles.types";
import { BATTLES } from "./battles.data";
import { supabase, isSupabaseConfigured } from "./supabase";

function mapRow(r: Record<string, unknown>): Battle {
  return {
    id: r.id as string,
    slug: r.slug as string,
    name: r.name as string,
    year: r.year as number,
    era: r.era as string,
    region: r.region as string,
    location: r.location as string,
    lat: Number(r.lat),
    lng: Number(r.lng),
    commanders: (r.commanders as Battle["commanders"]) ?? [],
    forces: (r.forces as Battle["forces"]) ?? {},
    casualties: (r.casualties as Battle["casualties"]) ?? {},
    outcome: (r.outcome as string) ?? "",
    hero_image: (r.hero_image as string) ?? "",
    summary: (r.summary as string) ?? "",
    narrative: (r.narrative as string) ?? "",
    background: (r.background as string) ?? null,
    course: (r.course as string) ?? null,
    turning_points: (r.turning_points as string) ?? null,
    aftermath: (r.aftermath as string) ?? null,
  };
}

export async function listBattles(): Promise<Battle[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [...BATTLES].sort((a, b) => a.year - b.year) as Battle[];
  }
  const { data, error } = await supabase
    .from("battles")
    .select("*")
    .order("year", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function getBattle({ data }: { data: { slug: string } }): Promise<Battle | null> {
  if (!isSupabaseConfigured || !supabase) {
    return (BATTLES.find((b) => b.slug === data.slug) as Battle | undefined) ?? null;
  }
  const { data: row, error } = await supabase
    .from("battles")
    .select("*")
    .eq("slug", data.slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return row ? mapRow(row) : null;
}

export async function listQuiz({ data }: { data: { battleId: string } }) {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data: rows, error } = await supabase
    .from("battle_quizzes")
    .select("id, battle_id, kind, question, options")
    .eq("battle_id", data.battleId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (rows ?? []).map((r, i) => ({
    id: r.id as string,
    battle_id: r.battle_id as string,
    kind: r.kind as "mc" | "tf",
    question: r.question as string,
    options: (r.options as string[]) ?? [],
    position: i,
  }));
}

export async function checkQuizAnswer({
  data,
}: {
  data: { questionId: string; answerIndex: number };
}) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Quiz checking requires Supabase configuration.");
  }
  const { data: row, error } = await supabase
    .from("battle_quizzes")
    .select("correct_index, explanation")
    .eq("id", data.questionId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!row) throw new Error("Question not found");
  return {
    correct: row.correct_index === data.answerIndex,
    correctIndex: row.correct_index as number,
    explanation: (row.explanation as string | null) ?? null,
  };
}

export async function listBattleImages({ data }: { data: { battleId: string } }) {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data: rows, error } = await supabase
    .from("battle_gallery")
    .select("id, url, created_at")
    .eq("battle_id", data.battleId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (rows ?? []).map((r, i) => ({
    id: r.id as string,
    url: r.url as string,
    caption: null as string | null,
    position: i,
  }));
}
