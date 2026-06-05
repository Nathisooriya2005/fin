import { sports } from "@/lib/sports-data";

export function Sports() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Pick your <span className="text-gradient">sport</span>
          </h2>
          <p className="text-muted-foreground mt-2">Find venues built for your game.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sports.map((s) => (
          <button key={s.id} className="relative rounded-2xl overflow-hidden h-72 group hover:-translate-y-1 transition-all duration-300 shadow-xl">
            <img
              src={s.image}
              alt={s.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
              <div className="font-bold text-xl sm:text-2xl">{s.name}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
