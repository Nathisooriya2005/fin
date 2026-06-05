import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { sports } from "@/lib/sports-data";

export const Route = createFileRoute("/sports")({
  head: () => ({ meta: [{ title: "Sports — TurfPro" }, { name: "description", content: "Cricket, Football, Badminton, Kabaddi and Karate venues." }] }),
  component: SportsPage,
});

function SportsPage() {
  console.log("Sports data:", sports);
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Our <span className="text-gradient">sports</span></h1>
        <p className="text-muted-foreground mt-2">Four sports. Hundreds of venues.</p>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {sports.map((s) => (
            <Link
              to="/turfs"
              key={s.id}
              className="group relative overflow-hidden rounded-2xl shadow-xl transition hover:-translate-y-1 hover:shadow-2xl h-80 bg-surface w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-sm"
            >
              <img
                src={s.image}
                alt={s.name}
                onError={(e) => { console.error("Image load error:", s.name, e); (e.target as HTMLImageElement).style.display = 'none'; }}
                onLoad={(e) => console.log("Image loaded:", s.name)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="font-semibold text-xl">{s.name}</div>
                <div className="text-sm opacity-90 mt-1">{s.desc}</div>
                <div className="text-sm text-primary-glow mt-4">Browse venues →</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
