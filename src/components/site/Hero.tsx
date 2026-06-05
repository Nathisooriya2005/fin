import heroImg from "@/assets/hero-turf.jpg";
import { useNavigate } from "@tanstack/react-router";
import { BookingForm } from "@/components/site/BookingForm";

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Sports turf" width={1920} height={1280} className="size-full object-cover brightness-[0.92] saturate-[1.15]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-32 sm:pt-28 sm:pb-40">
        <div className="text-center animate-[slide-up_0.7s_cubic-bezier(0.16,1,0.3,1)]">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="text-white drop-shadow-sm">Book your next </span>
            <span className="bg-gradient-to-r from-emerald-300 via-lime-200 to-teal-100 bg-clip-text text-transparent drop-shadow-sm">
              game in seconds.
            </span>
          </h1>
          <p className="mt-6 text-lg text-white/90 max-w-xl mx-auto drop-shadow-sm">
            Premium cricket & box turfs across Tamil Nadu. Real-time availability,
            instant confirmation, zero hassle.
          </p>

          <div className="mt-10">
            <BookingForm />
          </div>
        </div>
      </div>
    </section>
  );
}
