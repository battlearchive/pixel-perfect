export type Commander = { side: string; name: string; role: string };

export type Battle = {
  id: string;
  slug: string;
  name: string;
  year: number;
  era: string;
  region: string;
  location: string;
  lat: number;
  lng: number;
  commanders: Commander[];
  forces: Record<string, number>;
  casualties: Record<string, number>;
  outcome: string;
  hero_image: string;
  summary: string;
  narrative: string;
  background?: string | null;
  course?: string | null;
  turning_points?: string | null;
  aftermath?: string | null;
};

export type QuizQuestion = {
  id: string;
  battle_id: string;
  kind: "mc" | "tf";
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
  position: number;
};

export const ERAS: Record<string, { label: string; color: string; range: [number, number] }> = {
  ancient: { label: "ANCIENT", color: "#c9a84c", range: [-1000, 500] },
  medieval: { label: "MEDIEVAL", color: "#7b3f00", range: [500, 1500] },
  early_modern: { label: "EARLY MODERN", color: "#4a6b3a", range: [1500, 1789] },
  napoleonic: { label: "NAPOLEONIC", color: "#5d3a8c", range: [1789, 1815] },
  modern: { label: "INDUSTRIAL", color: "#2d6e8c", range: [1815, 1913] },
  ww1: { label: "GREAT WAR", color: "#6b4226", range: [1914, 1918] },
  ww2: { label: "WWII", color: "#8b1a1a", range: [1939, 1945] },
  contemporary: { label: "MODERN", color: "#475569", range: [1946, 2100] },
};

export function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

export function eraOf(year: number): string {
  if (year < 500) return "ancient";
  if (year < 1500) return "medieval";
  if (year < 1789) return "early_modern";
  if (year < 1815) return "napoleonic";
  if (year < 1914) return "modern";
  if (year < 1939) return "ww1";
  if (year <= 1945) return "ww2";
  return "contemporary";
}