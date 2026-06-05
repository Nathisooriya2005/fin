import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { userLogin } from "@/lib/booking-store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — TurfPro" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 4) {
      setErr("Enter a valid email and a password (4+ chars).");
      return;
    }
    userLogin(email);
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 grid place-items-center px-4 py-12">
        <form onSubmit={onSubmit} className="w-full max-w-md glass-card neon-border rounded-2xl p-8">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your bookings.</p>

          <div className="mt-6 space-y-3">
            <label className="block">
              <span className="text-xs text-muted-foreground">Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-1 w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" placeholder="you@example.com" />
            </label>
            <label className="block">
              <span className="text-xs text-muted-foreground">Password</span>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-1 w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" placeholder="••••••••" />
            </label>
            {err && <div className="text-xs text-destructive">{err}</div>}
            <button type="submit" className="w-full mt-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold shadow-[var(--shadow-glow)]">
              Sign in
            </button>
          </div>

        </form>
      </main>
      <Footer />
    </div>
  );
}
