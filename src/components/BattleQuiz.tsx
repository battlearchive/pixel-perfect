import { useState } from "react";
import { useAdminState, type AdminQuiz } from "@/lib/admin-store";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

export function BattleQuiz({ battleId }: { battleId: string }) {
  const { quizzes } = useAdminState();
  const questions = quizzes[battleId] ?? [];

  if (questions.length === 0) return null;

  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.4em] text-accent mb-3">Test yourself</div>
      <h2 className="font-display text-2xl mb-6">Quiz</h2>
      <div className="space-y-6">
        {questions.map((q, i) => (
          <QuizItem key={q.id} q={q} index={i} />
        ))}
      </div>
    </div>
  );
}

function QuizItem({ q, index }: { q: AdminQuiz; index: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [openAnswer, setOpenAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);

  if (q.kind === "open") {
    const accepted = (q.options ?? []).filter((o) => o.trim());
    const normalized = openAnswer.trim().toLowerCase();
    const isCorrect =
      revealed && accepted.some((a) => a.trim().toLowerCase() === normalized) && normalized.length > 0;
    return (
      <div className="rounded-sm border border-border/60 bg-card/40 p-5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Question {index + 1}
        </div>
        <div className="font-display text-lg mb-4">{q.question}</div>
        <textarea
          value={openAnswer}
          onChange={(e) => setOpenAnswer(e.target.value)}
          rows={2}
          disabled={revealed}
          className="w-full rounded-sm border border-border/60 bg-background px-3 py-2 text-sm"
          placeholder="Your answer…"
        />
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="mt-3 rounded-sm bg-accent px-4 py-2 text-xs uppercase tracking-[0.25em] font-semibold text-accent-foreground"
          >
            Check answer
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <div
              className={cn(
                "flex items-center gap-2 text-xs uppercase tracking-[0.25em]",
                isCorrect ? "text-green-400" : "text-red-400",
              )}
            >
              {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              {isCorrect ? "Correct" : "Not quite"}
            </div>
            {accepted.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <span className="uppercase tracking-[0.25em] text-[10px] text-accent mr-2">
                  Accepted:
                </span>
                {accepted.join(" · ")}
              </div>
            )}
            {q.explanation && (
              <div className="text-xs text-muted-foreground italic border-l-2 border-accent/40 pl-3">
                {q.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function pick(i: number) {
    if (revealed) return;
    setPicked(i);
    setRevealed(true);
  }

  return (
    <div className="rounded-sm border border-border/60 bg-card/40 p-5">
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
        Question {index + 1}
      </div>
      <div className="font-display text-lg mb-4">{q.question}</div>
      <div className="grid gap-2">
        {q.options.map((opt, i) => {
          const isCorrect = revealed && q.correct_index === i;
          const isPicked = i === picked;
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => pick(i)}
              className={cn(
                "flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm rounded-sm border transition-all",
                !revealed && "border-border/60 hover:border-accent/60 hover:bg-accent/5",
                revealed && isCorrect && "border-green-600/60 bg-green-900/20 text-green-100",
                revealed && isPicked && !isCorrect && "border-red-600/60 bg-red-900/20 text-red-100",
                revealed && !isPicked && !isCorrect && "border-border/30 opacity-60",
              )}
            >
              <span>{opt}</span>
              {revealed && isCorrect && <Check className="h-4 w-4" />}
              {revealed && isPicked && !isCorrect && <X className="h-4 w-4" />}
            </button>
          );
        })}
      </div>
      {revealed && q.explanation && (
        <div className="mt-4 text-xs text-muted-foreground italic border-l-2 border-accent/40 pl-3">
          {q.explanation}
        </div>
      )}
    </div>
  );
}
