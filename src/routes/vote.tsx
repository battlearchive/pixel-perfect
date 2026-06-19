import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Sword, Trophy, ChevronUp, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  listCandidates,
  getMyVote,
  castVote,
  type BattleCandidate,
} from "@/lib/vote.functions";
import { ERAS } from "@/lib/battles.types";

export const Route = createFileRoute("/vote")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Vote — Battle Archive" },
      { name: "description", content: "Vote for the next battle to be added to the archive. One vote per person per week." },
    ],
  }),
  component: VotePage,
});

// ── Era badge ────────────────────────────────────────────────────────────────
function EraBadge({ era }: { era: string }) {
  const meta = ERAS[era];
  if (!meta) return null;
  return (
    <span
      className="text-[9px] uppercase tracking-[0.25em] px-2 py-0.5 rounded-sm font-semibold"
      style={{ background: meta.color + "28", color: meta.color, border: `1px solid ${meta.color}40` }}
    >
      {meta.label}
    </span>
  );
}

// ── Progress bar ─────────────────────────────────────────────────────────────
function VoteBar({ count, max }: { count: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((count / max) * 100);
  return (
    <div className="mt-3 space-y-1">
      <div className="h-1.5 w-full rounded-full bg-border/60 overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground tracking-wide">
        <span>{count} {count === 1 ? "vote" : "votes"}</span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}

// ── Candidate card ───────────────────────────────────────────────────────────
function CandidateCard({
  candidate,
  rank,
  maxVotes,
  myVoteId,
  onVote,
  isVoting,
  isLoggedIn,
}: {
  candidate: BattleCandidate;
  rank: number;
  maxVotes: number;
  myVoteId: string | null;
  onVote: (id: string) => void;
  isVoting: boolean;
  isLoggedIn: boolean;
}) {
  const isMyVote = myVoteId === candidate.id;
  const hasVoted = myVoteId !== null;
  const isLeader = rank === 1;

  return (
    <div
      className={`relative rounded-sm border p-5 transition-all duration-200 ${
        isMyVote
          ? "border-accent bg-accent/5"
          : isLeader && !hasVoted
          ? "border-accent/40 bg-card/60"
          : "border-border/50 bg-card/40 hover:border-border"
      }`}
    >
      {/* Rank + leader crown */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className={`text-xs font-bold tabular-nums w-5 text-center ${isLeader ? "text-accent" : "text-muted-foreground"}`}>
            {isLeader ? <Trophy className="h-4 w-4 text-accent" /> : `#${rank}`}
          </span>
          <div>
            <h3 className="font-display text-base tracking-wide leading-tight">{candidate.name}</h3>
            <div className="mt-1">
              <EraBadge era={candidate.era} />
            </div>
          </div>
        </div>

        {/* Vote button */}
        {isLoggedIn ? (
          isMyVote ? (
            <div className="flex items-center gap-1.5 text-accent text-xs tracking-wide shrink-0 pt-0.5">
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline uppercase tracking-[0.2em]">Your vote</span>
            </div>
          ) : !hasVoted ? (
            <button
              onClick={() => onVote(candidate.id)}
              disabled={isVoting}
              className="flex items-center gap-1.5 shrink-0 rounded-sm border border-border bg-background px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
            >
              {isVoting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <ChevronUp className="h-3.5 w-3.5" />
              )}
              Vote
            </button>
          ) : null
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground text-[10px] shrink-0 pt-1">
            <Lock className="h-3 w-3" />
            <span className="hidden sm:inline">Login to vote</span>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{candidate.description}</p>

      <VoteBar count={candidate.vote_count} max={maxVotes} />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function VotePage() {
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ["vote-candidates"],
    queryFn: listCandidates,
    refetchInterval: 30_000,
  });

  const { data: myVote } = useQuery({
    queryKey: ["my-vote"],
    queryFn: getMyVote,
    enabled: isLoggedIn,
  });

  const voteMutation = useMutation({
    mutationFn: castVote,
    onSuccess: (err) => {
      if (err) {
        setError(err);
      } else {
        queryClient.invalidateQueries({ queryKey: ["vote-candidates"] });
        queryClient.invalidateQueries({ queryKey: ["my-vote"] });
      }
    },
  });

  const maxVotes = candidates.length > 0 ? Math.max(...candidates.map((c) => c.vote_count)) : 0;
  const myVoteId = myVote?.candidate_id ?? null;
  const totalVotes = candidates.reduce((s, c) => s + c.vote_count, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Sword className="h-4 w-4 text-accent" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-accent">Community</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight">
          What battle should I add next?
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Each week I add one new battle to the archive. You decide which one.
          {" "}
          <span className="text-foreground/70">One vote per person — the winner gets added next week.</span>
        </p>

        {/* Stats bar */}
        <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
          <span>{totalVotes} total {totalVotes === 1 ? "vote" : "votes"}</span>
          <span className="text-border">·</span>
          <span>{candidates.length} candidates</span>
          {myVoteId && (
            <>
              <span className="text-border">·</span>
              <span className="text-accent flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> You voted
              </span>
            </>
          )}
        </div>
      </div>

      {/* Not logged in banner */}
      {!isLoggedIn && (
        <div className="mb-6 flex items-center gap-3 rounded-sm border border-border/60 bg-card/50 px-4 py-3">
          <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">
            You need to{" "}
            <a href="/login" className="text-accent underline underline-offset-2 hover:no-underline">
              sign in
            </a>{" "}
            to cast your vote. You can still see the current standings below.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive">
          {error}
          <button onClick={() => setError(null)} className="ml-3 underline">Dismiss</button>
        </div>
      )}

      {/* Candidates */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span className="text-sm">Loading candidates…</span>
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm">
          No candidates yet — check back soon.
        </div>
      ) : (
        <div className="space-y-3">
          {candidates.map((c, i) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              rank={i + 1}
              maxVotes={maxVotes}
              myVoteId={myVoteId}
              onVote={(id) => {
                setError(null);
                voteMutation.mutate(id);
              }}
              isVoting={voteMutation.isPending}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      )}

      {/* Footer note */}
      <p className="mt-10 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50">
        votes reset weekly-Winner added next week
      </p>
    </div>
  );
}
