import { Smartphone } from "lucide-react";
import { InstallButton } from "./InstallButton";
import { NotificationButton } from "./NotificationButton";

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="relative overflow-hidden rounded-3xl glass-card neon-border p-8 sm:p-14">
        <div className="absolute -top-24 -right-24 size-80 rounded-full opacity-40 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary-glow text-xs font-medium mb-4">
              <Smartphone className="size-3.5" /> Install the app
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Your next match is <span className="text-gradient">one tap away.</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md">
              Push notifications for your favourite turfs, instant slot alerts, and offline access to the app.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <InstallButton />
              <NotificationButton />
            </div>
          </div>

          <div className="relative hidden md:flex justify-center">
            <div className="size-72 rounded-[2.5rem] glass-card neon-border p-3 rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="size-full rounded-3xl bg-gradient-to-br from-surface to-background p-6 flex flex-col">
                <div className="text-xs text-muted-foreground">Today · 7:00 PM</div>
                <div className="font-bold text-xl mt-2">Velocity Arena</div>
                <div className="text-sm text-muted-foreground">Football · 5-a-side</div>
                <div className="mt-auto">
                  <div className="text-xs text-success flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-success animate-pulse" />
                    Confirmed
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-surface overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary-glow" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
