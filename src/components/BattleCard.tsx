import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Battle } from "@/lib/battles.types";
import { ERAS, formatYear } from "@/lib/battles.types";

export function BattleCard({ battle, index = 0 }: { battle: Battle; index?: number }) {
  const era = ERAS[battle.era];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link
        to="/battles/$slug"
        params={{ slug: battle.slug }}
        className="group relative block overflow-hidden rounded-sm border border-border/50 bg-card transition-all hover:border-accent/60 hover:shadow-[0_20px_60px_-20px_rgba(201,168,76,0.3)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={battle.hero_image}
            alt={`${battle.name} (${formatYear(battle.year)}) — ${battle.location}`}
            loading="lazy"
            width={1280}
            height={768}
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div
            className="absolute top-3 left-3 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] font-semibold rounded-sm"
            style={{ backgroundColor: `${era?.color}cc`, color: "#fff" }}
          >
            {era?.label ?? battle.era}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="font-display text-xl text-foreground tracking-tight group-hover:text-accent transition-colors">
              {battle.name}
            </h3>
            <span className="text-xs tracking-widest text-muted-foreground">{formatYear(battle.year)}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{battle.summary}</p>
          <div className="mt-4 text-[10px] uppercase tracking-[0.25em] text-accent/80 group-hover:text-accent">
            Read chronicle →
          </div>
        </div>
      </Link>
    </motion.div>
  );
}