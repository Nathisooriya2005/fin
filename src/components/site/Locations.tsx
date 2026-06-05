const cities = [
  { name: "Chennimalai", count: 6 },
];

export function Locations() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Popular in <span className="text-gradient">Tamil Nadu</span>
        </h2>
        <p className="text-muted-foreground mt-2">Discover turfs in your city.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {cities.map((c) => (
          <button
            key={c.name}
            className="glass-card rounded-xl px-5 py-4 flex items-center justify-between hover:neon-border transition group"
          >
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.count} turfs</div>
            </div>
            <div className="text-primary-glow group-hover:translate-x-1 transition">→</div>
          </button>
        ))}
      </div>
    </section>
  );
}
