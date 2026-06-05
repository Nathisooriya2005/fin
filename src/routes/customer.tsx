import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/customer")({
  head: () => ({ meta: [{ title: "Customer Portal — TurfPro" }, { name: "description", content: "Access the TurfPro customer portal for bookings, nearby venues and co-player events." }] }),
  component: CustomerPortal,
});

function CustomerPortal() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Customer Portal</h1>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Access TurfPro customer features without admin controls. Browse turfs, and join nearby events.
            </p>
          </div>
          <div className="rounded-3xl border border-border p-6 glass-card">
            <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Welcome</div>
            <p className="mt-4 text-sm text-foreground">Use the portal below to reach the customer-facing booking experience.</p>
            <div className="mt-6 grid gap-3">
              <Link to="/turfs" className="block rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground text-center">Browse turfs</Link>
              <Link to="/turfs" className="block rounded-2xl border border-border px-4 py-3 text-sm text-foreground text-center">Find co-players</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
