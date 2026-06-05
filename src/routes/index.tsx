import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Sports } from "@/components/site/Sports";
import { Testimonials } from "@/components/site/Testimonials";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sports spitch — Book Sports Turfs in Tamil Nadu" },
      {
        name: "description",
        content:
          "Book premium cricket, football and box cricket turfs across Tamil Nadu in seconds. Real-time slot availability, instant confirmation.",
      },
      { property: "og:title", content: "Sports spitch — Book Sports Turfs in Tamil Nadu" },
      {
        property: "og:description", content: "Real-time turf booking for cricket, football & more across Tamil Nadu." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Sports />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
