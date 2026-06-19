import { supabase } from "./supabase";

export type BattleCandidate = {
  id: string;
  name: string;
  era: string;
  description: string;
  vote_count: number;
};

export type UserVote = {
  candidate_id: string;
} | null;

// Fetch all candidates with their vote counts
export async function listCandidates(): Promise<BattleCandidate[]> {
  const { data, error } = await supabase
    .from("vote_candidates")
    .select("id, name, era, description, vote_count")
    .eq("active", true)
    .order("vote_count", { ascending: false });
  if (error) throw new Error("Could not load candidates.");
  return data ?? [];
}

// Get the current user's vote for this week (null if not voted)
export async function getMyVote(): Promise<UserVote> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("battle_votes")
    .select("candidate_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return null;
  return data ?? null;
}

// Cast a vote — returns error string or null on success
export async function castVote(candidateId: string): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "You need to be logged in to vote.";

  const { error } = await supabase
    .from("battle_votes")
    .insert({ user_id: user.id, candidate_id: candidateId });

  if (error) {
    if (error.code === "23505") return "You have already voted this week.";
    return "Something went wrong. Please try again.";
  }
  return null;
}
