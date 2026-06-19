import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Battle } from "@/lib/battles.types";
import { ERAS, formatYear } from "@/lib/battles.types";

// Map a year onto a 0..1 position on the timeline (piecewise so dense modern era isn't crammed).
const STOPS: [number, number][] = [
  [-1000, 0],
  [-500, 0.12],
  [0, 0.22],
  [500, 0.3],
  [1000, 0.4],
  [1500, 0.55],
  [1789, 0.7],
  [1815, 0.76],
  [1914, 0.88],
  [1945, 0.97],
  [2000, 1],
];
function pos(year: number): number {
  const y = Math.max(-1000, Math.min(2000, year));
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [y0, p0] = STOPS[i];
    const [y1, p1] = STOPS[i + 1];
    if (y >= y0 && y <= y1) {
      const t = (y - y0) / (y1 - y0);
      return p0 + t * (p1 - p0);
    }
  }
  return 1;
}

export function Timeline({ battles }: { battles: Battle[] }) {
  const WIDTH = 3600; // px of inner scroll width
  const sorted = [...battles].sort((a, b) => a.year - b.year);

  // Lane assignment to avoid overlap
  const lanes: number[] = []; // last x used per lane
  const placed = sorted.map((b) => {
    const x = pos(b.year) * WIDTH;
    let lane = lanes.findIndex((lx) => x - lx > 110);
    if (lane === -1) {
      lane = lanes.length;
      lanes.push(x);
    } else {
      lanes[lane] = x;
    }
    return { b, x, lane };
  });
  const laneCount = Math.max(lanes.length, 4);
  const HEIGHT = 120 + laneCount * 100;

  const decades = [-1000, -500, -250, 0, 500, 1000, 1300, 1500, 1700, 1800, 1900, 1950, 2000];

  return (
    <div className="overflow-x-auto overflow-y-hidden border-y border-border/40 bg-card/20">
      <div className="relative" style={{ width: WIDTH, height: HEIGHT }}>
        {/* Era bands */}
        {Object.entries(ERAS).map(([key, era]) => {
          const x1 = pos(era.range[0]) * WIDTH;
          const x2 = pos(era.range[1]) * WIDTH;
          return (
            <div
              key={key}
              className="absolute top-0 h-full opacity-[0.08]"
              style={{ left: x1, width: x2 - x1, background: era.color }}
            />
          );
        })}
        {/* Era labels */}
        {Object.entries(ERAS).map(([key, era]) => {
          const x1 = pos(era.range[0]) * WIDTH;
          const x2 = pos(era.range[1]) * WIDTH;
          return (
            <div
              key={`l-${key}`}
              className="absolute top-4 text-[10px] uppercase tracking-[0.3em] font-semibold"
              style={{ left: x1 + 12, width: x2 - x1 - 24, color: era.color }}
            >
              {era.label}
            </div>
          );
        })}

        {/* Central axis */}
        <div className="absolute left-0 right-0" style={{ top: 70 }}>
          <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        </div>

        {/* Decade ticks */}
        {decades.map((d) => {
          const x = pos(d) * WIDTH;
          return (
            <div key={d} className="absolute" style={{ left: x, top: 60 }}>
              <div className="h-5 w-px bg-muted-foreground/40" />
              <div className="absolute top-6 -translate-x-1/2 text-[10px] tracking-widest text-muted-foreground whitespace-nowrap">
                {formatYear(d)}
              </div>
            </div>
          );
        })}

        {/* Battle markers */}
        {placed.map(({ b, x, lane }, i) => {
          const era = ERAS[b.era];
          const top = 110 + lane * 100;
          const above = lane % 2 === 0;
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: above ? -10 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.6) }}
              className="absolute"
              style={{ left: x, top }}
            >
              {/* Connector */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-accent/40 to-accent/0"
                style={{
                  height: top - 70,
                  bottom: above ? undefined : "100%",
                  top: above ? undefined : -(top - 70),
                }}
              />
              <Link
                to="/battles/$slug"
                params={{ slug: b.slug }}
                className="group block w-52 -translate-x-1/2 rounded-sm border border-border/60 bg-background/95 p-3 backdrop-blur transition-all hover:border-accent hover:shadow-[0_10px_30px_-10px_rgba(201,168,76,0.4)]"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ background: era?.color, boxShadow: `0 0 10px ${era?.color}` }}
                  />
                  <div className="text-[10px] tracking-widest text-muted-foreground">{formatYear(b.year)}</div>
                </div>
                <div className="mt-1 font-display text-sm text-foreground group-hover:text-accent transition-colors leading-tight">
                  {b.name}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{b.location}</div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}