import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "/" as const, label: "Home" },
    { to: "/battles" as const, label: "Battles" },
    { to: "/timeline" as const, label: "Timeline" },
    { to: "/vote" as const, label: "Vote" },
    { to: "/about" as const, label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/assets/logo.png"
            alt="Battle Archive crest"
            className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(201,168,76,0.35)] transition-transform group-hover:scale-110"
            width={40}
            height={40}
          />
          <div className="leading-tight">
            <div className="font-display text-lg tracking-[0.18em] text-foreground">BATTLE ARCHIVE</div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground hidden sm:block">Chronicles of War</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm tracking-wider uppercase" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-muted-foreground transition-colors hover:text-accent"
              activeProps={{ className: "text-accent" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-sm border border-border/60 text-accent"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-background/95 backdrop-blur-md border-l border-border/60">
            <SheetHeader>
              <SheetTitle className="font-display text-xl tracking-[0.15em] text-foreground">BATTLE ARCHIVE</SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-2" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <SheetClose asChild key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center rounded-sm px-4 py-3 text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                    activeProps={{ className: "text-accent bg-accent/10" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

