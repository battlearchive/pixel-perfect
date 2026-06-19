import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { adminActions, newBlankBattle, useAdminState, type AdminBattle } from "@/lib/admin-store";
import { ERAS } from "@/lib/battles.types";

export const Route = createFileRoute("/adminsmfqefks26537xK9pLm2WqRtY8vN3hJ7bF4cD1zA5sE6gU0iO9pX2nM4kQ8wV3jB7yT5rH1/edit/$battleId")({
  head: () => ({ meta: [{ title: "Edit battle — Admin" }, { name: "robots", content: "noindex" }] }),
  component: EditBattlePage,
});

function EditBattlePage() {
  const { battleId } = Route.useParams();
  const router = useRouter();
  const { battles } = useAdminState();

  const initial = useMemo<AdminBattle>(() => {
    if (battleId === "new") return newBlankBattle();
    return battles.find((b) => b.id === battleId) ?? newBlankBattle();
  }, [battleId, battles]);

  const [form, setForm] = useState<AdminBattle>(initial);

  function update<K extends keyof AdminBattle>(key: K, value: AdminBattle[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSave() {
    if (!form.name.trim() || !form.slug.trim()) {
      alert("Name and slug are required.");
      return;
    }
    try {
      await adminActions.upsertBattle(form);
      router.navigate({ to: "/adminsmfqefks26537xK9pLm2WqRtY8vN3hJ7bF4cD1zA5sE6gU0iO9pX2nM4kQ8wV3jB7yT5rH1" });
    } catch (e) {
      alert(`Save failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  async function onUploadHero(file: File) {
    const url = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    update("hero_image", url);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl tracking-tight">Edit battle</h1>
        <Link to="/adminsmfqefks26537xK9pLm2WqRtY8vN3hJ7bF4cD1zA5sE6gU0iO9pX2nM4kQ8wV3jB7yT5rH1" className="text-xs uppercase tracking-[0.25em] text-accent hover:underline">
          ← Back
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name">
          <Input value={form.name} onChange={(v) => update("name", v)} />
        </Field>
        <Field label="Slug (URL-safe)">
          <Input value={form.slug} onChange={(v) => update("slug", v)} />
        </Field>
        <Field label="Year (negative for BC)">
          <Input
            type="number"
            value={String(form.year)}
            onChange={(v) => update("year", Number(v) || 0)}
          />
        </Field>
        <Field label="Era">
          <select
            value={form.era}
            onChange={(e) => update("era", e.target.value)}
            className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm uppercase tracking-wider"
          >
            {Object.entries(ERAS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Region">
          <Input value={form.region} onChange={(v) => update("region", v)} />
        </Field>
        <Field label="Location">
          <Input value={form.location} onChange={(v) => update("location", v)} />
        </Field>
        <Field label="Latitude">
          <Input
            type="number"
            value={String(form.lat)}
            onChange={(v) => update("lat", Number(v) || 0)}
          />
        </Field>
        <Field label="Longitude">
          <Input
            type="number"
            value={String(form.lng)}
            onChange={(v) => update("lng", Number(v) || 0)}
          />
        </Field>
        <Field label="Outcome (one line)" className="md:col-span-2">
          <Input value={form.outcome} onChange={(v) => update("outcome", v)} />
        </Field>
      </div>

      {/* Hero image */}
      <section className="mt-8 rounded-sm border border-border/60 p-5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Hero image</div>
        {form.hero_image && (
          <img
            src={form.hero_image}
            alt=""
            className="w-full max-h-64 object-cover rounded-sm border border-border/60 mb-3"
          />
        )}
        <div className="flex items-center gap-3 mb-3">
          <label className="inline-flex items-center gap-2 rounded-sm border border-border bg-background px-4 py-2 text-xs uppercase tracking-[0.25em] cursor-pointer hover:bg-secondary">
            <Upload className="h-3.5 w-3.5" /> Upload image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUploadHero(f);
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => update("hero_image", "")}
            className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-destructive"
          >
            Clear
          </button>
        </div>
        <Input
          value={form.hero_image}
          onChange={(v) => update("hero_image", v)}
          placeholder="/assets/your-image.jpg"
        />
      </section>

      <Field label="Summary (1–3 sentences)" className="mt-8 block">
        <Textarea value={form.summary} onChange={(v) => update("summary", v)} rows={3} />
      </Field>
      <Field label="Full narrative (fallback)" className="mt-5 block">
        <Textarea value={form.narrative} onChange={(v) => update("narrative", v)} rows={6} />
      </Field>

      <h2 className="mt-10 text-[10px] uppercase tracking-[0.3em] text-accent">Narrative sections (tabs)</h2>
      <Field label="Background" className="mt-3 block">
        <Textarea value={form.background ?? ""} onChange={(v) => update("background", v)} rows={3} />
      </Field>
      <Field label="Course of battle" className="mt-5 block">
        <Textarea value={form.course ?? ""} onChange={(v) => update("course", v)} rows={3} />
      </Field>
      <Field label="Turning points" className="mt-5 block">
        <Textarea value={form.turning_points ?? ""} onChange={(v) => update("turning_points", v)} rows={3} />
      </Field>
      <Field label="Aftermath" className="mt-5 block">
        <Textarea value={form.aftermath ?? ""} onChange={(v) => update("aftermath", v)} rows={3} />
      </Field>
      <Field label="Fun fact (optional — shows as a special tab)" className="mt-5 block">
        <Textarea value={form.fun_fact ?? ""} onChange={(v) => update("fun_fact", v)} rows={3} />
      </Field>

      <details className="mt-10 rounded-sm border border-border/60 p-5 group" open>
        <summary className="cursor-pointer text-[10px] uppercase tracking-[0.3em] text-accent list-none flex items-center gap-2">
          <span className="transition-transform group-open:rotate-90">▶</span> Advanced (JSON)
        </summary>
        <div className="mt-5 space-y-5">
          <JsonField
            label='Commanders — [{"side","name","role"}]'
            value={form.commanders}
            onChange={(v) => update("commanders", v as AdminBattle["commanders"])}
            rows={6}
          />
          <JsonField
            label='Forces — {"side": number}'
            value={form.forces}
            onChange={(v) => update("forces", v as AdminBattle["forces"])}
            rows={4}
          />
          <JsonField
            label='Casualties — {"side": number}'
            value={form.casualties}
            onChange={(v) => update("casualties", v as AdminBattle["casualties"])}
            rows={4}
          />
        </div>
      </details>

      <div className="mt-10 flex justify-end gap-3">
        <Link
          to="/adminsmfqefks26537xK9pLm2WqRtY8vN3hJ7bF4cD1zA5sE6gU0iO9pX2nM4kQ8wV3jB7yT5rH1"
          className="rounded-sm border border-border bg-background px-5 py-2.5 text-xs uppercase tracking-[0.25em] hover:bg-secondary"
        >
          Cancel
        </Link>
        <button
          onClick={onSave}
          className="rounded-sm bg-accent px-6 py-2.5 text-xs uppercase tracking-[0.25em] font-semibold text-accent-foreground hover:shadow-[0_10px_30px_-10px_rgba(201,168,76,0.6)]"
        >
          Save battle
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <div className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2">{label}</div>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm font-mono leading-relaxed"
    />
  );
}

function JsonField({
  label,
  value,
  onChange,
  rows = 5,
}: {
  label: string;
  value: unknown;
  onChange: (v: unknown) => void;
  rows?: number;
}) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [err, setErr] = useState<string | null>(null);
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</div>
      <textarea
        value={text}
        rows={rows}
        onChange={(e) => {
          const t = e.target.value;
          setText(t);
          try {
            onChange(JSON.parse(t));
            setErr(null);
          } catch (e: unknown) {
            setErr(e instanceof Error ? e.message : "Invalid JSON");
          }
        }}
        className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm font-mono leading-relaxed"
      />
      {err && <div className="mt-1 text-xs text-destructive">{err}</div>}
    </label>
  );
}
