import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, LogOut, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { adminActions, useAdminState, type AdminQuiz } from "@/lib/admin-store";
import { ERAS, formatYear } from "@/lib/battles.types";

export const Route = createFileRoute("/adminsmfqefks26537xK9pLm2WqRtY8vN3hJ7bF4cD1zA5sE6gU0iO9pX2nM4kQ8wV3jB7yT5rH1/")({
  head: () => ({ meta: [{ title: "Admin — Battle Archive" }, { name: "robots", content: "noindex" }] }),
  component: AdminHome,
});

type Tab = "battles" | "invites";

function AdminHome() {
  const router = useRouter();
  const { battles } = useAdminState();
  const [tab, setTab] = useState<Tab>("battles");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function signOut() {
    await supabase.auth.signOut();
    await router.navigate({ to: "/login" });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-8">
        <div>
          <div className="text-[10px] uppercase tracking-[0.35em] text-accent">Battle Archive</div>
          <h1 className="font-display text-3xl sm:text-4xl mt-1 tracking-tight">Admin</h1>
        </div>
        <div className="flex items-center gap-4 pt-0 sm:pt-2">
          <Link to="/" className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-accent">
            View site
          </Link>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-sm border border-border bg-background px-4 py-2 text-xs uppercase tracking-[0.25em] hover:bg-secondary"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/40">
        {[
          { k: "battles", label: "Battles & Quizzes" },
          { k: "invites", label: "Invite Admins" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as Tab)}
            className={`px-4 py-3 text-[11px] uppercase tracking-[0.25em] font-semibold -mb-px border-b-2 transition-colors ${
              tab === t.k ? "text-accent border-accent" : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "invites" ? (
        <InvitesTab />
      ) : (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">{battles.length} battles</p>
            <Link
              to="/adminsmfqefks26537xK9pLm2WqRtY8vN3hJ7bF4cD1zA5sE6gU0iO9pX2nM4kQ8wV3jB7yT5rH1/edit/$battleId"
              params={{ battleId: "new" }}
              className="inline-flex items-center gap-2 rounded-sm bg-accent px-4 py-2 text-xs uppercase tracking-[0.25em] font-semibold text-accent-foreground hover:shadow-[0_10px_30px_-10px_rgba(201,168,76,0.6)]"
            >
              <Plus className="h-3.5 w-3.5" /> New battle
            </Link>
          </div>

          <ul className="space-y-3">
            {battles.map((b) => {
              const isOpen = expanded === b.id;
              const era = ERAS[b.era];
              return (
                <li key={b.id} className="rounded-sm border border-border/60 bg-card/40">
                  <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3">
                    <button
                      onClick={() => setExpanded(isOpen ? null : b.id)}
                      className="text-muted-foreground hover:text-foreground shrink-0"
                      aria-label="Toggle"
                    >
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-base sm:text-lg truncate">{b.name || "Untitled battle"}</div>
                      <div className="text-xs text-muted-foreground">
                        {b.year ? formatYear(b.year) : "—"} · {b.location || era?.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to="/adminsmfqefks26537xK9pLm2WqRtY8vN3hJ7bF4cD1zA5sE6gU0iO9pX2nM4kQ8wV3jB7yT5rH1/edit/$battleId"
                        params={{ battleId: b.id }}
                        className="rounded-sm border border-border bg-background px-3 sm:px-4 py-2 text-xs uppercase tracking-[0.25em] hover:bg-secondary"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${b.name}"?`)) adminActions.deleteBattle(b.id);
                        }}
                        className="rounded-sm border border-destructive/60 bg-destructive/10 p-2 text-destructive hover:bg-destructive/20"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {isOpen && <ExpandedBattle battleId={b.id} battleName={b.name} year={b.year} location={b.location} />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function InvitesTab() {
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState<string[]>([]);
  return (
    <div className="mt-8 max-w-xl">
      <h2 className="font-display text-2xl mb-2">Invite admins</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Invitations are stored locally only — no email is sent.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!email) return;
          setInvites((v) => [...v, email]);
          setEmail("");
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm"
        />
        <button className="rounded-sm bg-accent px-4 py-2 text-xs uppercase tracking-[0.25em] font-semibold text-accent-foreground">
          Invite
        </button>
      </form>
      <ul className="mt-6 space-y-2">
        {invites.map((e, i) => (
          <li key={i} className="flex items-center justify-between rounded-sm border border-border/60 px-3 py-2 text-sm">
            <span>{e}</span>
            <button
              onClick={() => setInvites((v) => v.filter((_, idx) => idx !== i))}
              className="text-destructive text-xs uppercase tracking-widest"
            >
              Remove
            </button>
          </li>
        ))}
        {invites.length === 0 && <li className="text-sm text-muted-foreground">No invites yet.</li>}
      </ul>
    </div>
  );
}

function ExpandedBattle({
  battleId,
  battleName,
  year,
  location,
}: {
  battleId: string;
  battleName: string;
  year: number;
  location: string;
}) {
  const { quizzes, gallery } = useAdminState();
  const qs = quizzes[battleId] ?? [];
  const imgs = gallery[battleId] ?? [];

  return (
    <div className="border-t border-border/40 px-6 py-6 space-y-8 bg-background/40">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="font-display text-xl text-destructive">{battleName}</div>
          <div className="text-xs text-muted-foreground">
            {year ? formatYear(year) : "—"} · {location}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent">Gallery images</h3>
          <label className="inline-flex items-center gap-2 rounded-sm border border-accent/60 bg-accent/10 text-accent px-3 py-1.5 text-xs uppercase tracking-[0.25em] cursor-pointer hover:bg-accent/20">
            <Upload className="h-3.5 w-3.5" /> Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = await fileToDataUrl(file);
                adminActions.addImage(battleId, url);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {imgs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No images yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {imgs.map((i) => (
              <div key={i.id} className="relative group">
                <img src={i.url} alt="" className="w-full h-28 object-cover rounded-sm border border-border/60" />
                <button
                  onClick={() => adminActions.deleteImage(battleId, i.id)}
                  className="absolute top-1 right-1 rounded-sm bg-destructive/90 text-destructive-foreground p-1 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quiz questions */}
      <section>
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Quiz questions</h3>
        {qs.length === 0 ? (
          <p className="text-sm text-muted-foreground mb-4">No questions yet.</p>
        ) : (
          <ul className="space-y-2 mb-4">
            {qs.map((q) => (
              <li key={q.id} className="flex items-start justify-between gap-3 rounded-sm border border-border/60 px-3 py-2">
                <div className="text-sm">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {q.kind === "mc" ? "Multiple choice" : q.kind === "tf" ? "True / False" : "Open question"}
                  </div>
                  <div className="mt-0.5">{q.question}</div>
                </div>
                <button
                  onClick={() => adminActions.deleteQuiz(battleId, q.id)}
                  className="text-destructive p-1"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <QuizComposer battleId={battleId} />
      </section>
    </div>
  );
}

function QuizComposer({ battleId }: { battleId: string }) {
  const [kind, setKind] = useState<AdminQuiz["kind"]>("mc");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [openAnswers, setOpenAnswers] = useState<string[]>([""]);
  const [explanation, setExplanation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrect(0);
    setOpenAnswers([""]);
    setExplanation("");
    setError(null);
  }

  async function add() {
    setError(null);
    if (!question.trim()) {
      setError("Question is required.");
      return;
    }
    let opts: string[] = [];
    if (kind === "mc") {
      opts = options.map((o) => o.trim()).filter(Boolean);
      if (opts.length < 2) {
        setError("Add at least 2 answer options.");
        return;
      }
    } else if (kind === "tf") {
      opts = ["True", "False"];
    } else {
      opts = openAnswers.map((a) => a.trim()).filter(Boolean);
      if (opts.length < 1) {
        setError("Add at least one accepted answer.");
        return;
      }
    }
    try {
      setSaving(true);
      await adminActions.addQuiz(battleId, {
        kind,
        question: question.trim(),
        options: opts,
        correct_index: kind === "open" ? 0 : correct,
        explanation: explanation.trim() || null,
      });
      reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-sm border border-border/60 bg-card/40 p-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        {([
          ["mc", "Multiple choice"],
          ["tf", "True / False"],
          ["open", "Open question"],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`px-3 py-1.5 rounded-sm text-[10px] uppercase tracking-[0.25em] border ${
              kind === k ? "border-accent text-accent bg-accent/10" : "border-border text-muted-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <input
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
      />
      {kind === "mc" && (
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${battleId}`}
                checked={correct === i}
                onChange={() => setCorrect(i)}
              />
              <input
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => setOptions((o) => o.map((v, idx) => (idx === i ? e.target.value : v)))}
                className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
      )}
      {kind === "tf" && (
        <div className="flex gap-4 text-sm">
          {["True", "False"].map((v, i) => (
            <label key={v} className="flex items-center gap-2">
              <input
                type="radio"
                name={`tf-${battleId}`}
                checked={correct === i}
                onChange={() => setCorrect(i)}
              />
              {v}
            </label>
          ))}
        </div>
      )}
      {kind === "open" && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Accepted answers (case-insensitive match — add as many variants as you want)
          </div>
          {openAnswers.map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                placeholder={`Accepted answer ${i + 1}`}
                value={a}
                onChange={(e) =>
                  setOpenAnswers((arr) => arr.map((v, idx) => (idx === i ? e.target.value : v)))
                }
                className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm"
              />
              {openAnswers.length > 1 && (
                <button
                  type="button"
                  onClick={() => setOpenAnswers((arr) => arr.filter((_, idx) => idx !== i))}
                  className="rounded-sm border border-destructive/60 text-destructive p-2"
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setOpenAnswers((arr) => [...arr, ""])}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.25em] text-accent hover:underline"
          >
            <Plus className="h-3 w-3" /> Add another answer
          </button>
        </div>
      )}
      <textarea
        placeholder="Explanation (shown after answering)"
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        rows={2}
        className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
      />
      {error && <div className="text-xs text-destructive">{error}</div>}
      <button
        type="button"
        onClick={add}
        disabled={saving}
        className="rounded-sm bg-accent px-4 py-2 text-xs uppercase tracking-[0.25em] font-semibold text-accent-foreground disabled:opacity-60"
      >
        {saving ? "Saving…" : "Add question"}
      </button>
    </div>
  );
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
