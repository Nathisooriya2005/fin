const reviews = [
  { name: "Arjun R.", role: "Weekend Cricketer", text: "Booked a slot in 30 seconds. The turf was exactly as shown — floodlights on point. Best app for Chennai players." },
  { name: "Karthik M.", role: "Box Cricket Regular", text: "Live availability is a game-changer. I grab last-minute slots on my way home from work." },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Loved by <span className="text-gradient">players</span>
        </h2>
        <p className="text-muted-foreground mt-2">Real stories from real games.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <figure key={r.name} className="glass-card rounded-2xl p-6">
            <blockquote className="text-sm leading-relaxed text-foreground/90">"{r.text}"</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <div className="size-10 rounded-full bg-gradient-to-br from-primary to-primary-glow grid place-items-center font-bold text-primary-foreground">{r.name[0]}</div>
              <div>
                <div className="font-semibold text-sm">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
