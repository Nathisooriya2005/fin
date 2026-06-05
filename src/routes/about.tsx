import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import aboutBackground from "@/assets/about-background.jpg";
import { Phone, Mail, MapPin } from "lucide-react";


export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — TurfPro" }, { name: "description", content: "About TurfPro, Tamil Nadu's sports turf booking platform." }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="relative min-h-[60vh]">
        <div className="absolute inset-0 -z-10">
          <img
            src={aboutBackground}
            alt="About background"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", e);
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-transparent" />
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 relative">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-sm">About <span className="bg-gradient-to-r from-emerald-300 via-lime-200 to-teal-100 bg-clip-text text-transparent drop-shadow-sm">TurfPro</span></h1>
          <p className="text-white/90 mt-4 leading-relaxed drop-shadow-sm">
            TurfPro is Tamil Nadu's premier platform for booking sports turfs in real-time. We help
            players discover and reserve cricket, badminton, kabaddi and karate venues
            across the state — with live slot availability and instant confirmation.
          </p>
          <p className="text-white/90 mt-4 leading-relaxed drop-shadow-sm">
            Built for the modern player, the app installs to your home screen, works offline and gives
            you push notifications for your favourite venues.
          </p>

          <div className="mt-10 grid sm:grid-cols-1 gap-4">
            <div className="flex items-center gap-3 text-white/90">
              <Phone className="size-5 text-primary-glow" />
              <span className="text-lg font-medium">98657 50184</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Mail className="size-5 text-primary-glow" />
              <span className="text-lg font-medium">contact@turfpro.com</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <MapPin className="size-5 text-primary-glow" />
              <span className="text-lg font-medium">Chennimalai, Tamil Nadu</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
