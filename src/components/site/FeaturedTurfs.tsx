import { MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/booking-store";
import { BookingModal } from "./BookingModal";
import type { Turf } from "@/lib/booking-store";

const statusStyles: Record<string, string> = {
  available: "bg-success/90 text-success-foreground",
  pending: "bg-warning/90 text-foreground",
  unavailable: "bg-destructive/90 text-destructive-foreground",
};

export function FeaturedTurfs() {
  const { turfs } = useStore();
  const [active, setActive] = useState<Turf | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Featured <span className="text-gradient">venues</span>
          </h2>
          <p className="text-muted-foreground mt-2">Top-rated turfs near you.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {turfs.map((t) => (
          <article key={t.id} className="glass-card rounded-2xl overflow-hidden group hover:neon-border hover:-translate-y-1 transition-all duration-300">
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-surface to-background grid place-items-center">
              <div className="text-7xl">{sportEmoji(t.sport)}</div>
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium glass-card text-foreground">{t.sport}</div>
              <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[t.availability]} flex items-center gap-1 capitalize`}>
                <span className="size-1.5 rounded-full bg-current animate-pulse" />
                {t.availability}
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-lg leading-tight">{t.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                <MapPin className="size-3.5" />
                {t.location}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-success mt-3">
                <Clock className="size-3.5" />
                Live slots available
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Starts at</div>
                  <div className="text-xl font-bold">₹{t.price}<span className="text-xs text-muted-foreground font-normal">/hr</span></div>
                </div>
                <button
                  disabled={t.availability === "unavailable"}
                  onClick={() => setActive(t)}
                  className="px-5 py-3 rounded-xl text-lg font-bold bg-white text-black hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Book now
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <BookingModal turf={active} onClose={() => setActive(null)} />
    </section>
  );
}

function sportEmoji(sport: string) {
  const s = sport.toLowerCase();
  if (s.includes("cricket")) return "🏏";
  if (s.includes("football")) return "⚽";
  if (s.includes("badminton")) return "🏸";
  if (s.includes("kabaddi")) return "🤼";
  if (s.includes("karate")) return "🥋";
  return "🏟️";
}
