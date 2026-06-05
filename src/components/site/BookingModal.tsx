import { useEffect, useState } from "react";
import { X, CheckCircle2, MapPin } from "lucide-react";
import { addBooking, type TimeBatch, type Turf } from "@/lib/booking-store";

interface Props {
  turf: Turf | null;
  onClose: () => void;
}

const BATCHES: { value: TimeBatch; label: string }[] = [
  { value: "morning", label: "Morning batch" },
  { value: "evening", label: "Evening batch" },
  { value: "night", label: "Night batch" },
];

export function BookingModal({ turf, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [datetime, setDatetime] = useState("");
  const [players, setPlayers] = useState(10);
  const [batch, setBatch] = useState<TimeBatch>("morning");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [dealNotes, setDealNotes] = useState("");
  const [nightUnlocked, setNightUnlocked] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (turf) {
      setDone(false);
      setName("");
      setPhone("");
      setEmail("");
      setDatetime("");
      setPlayers(10);
      setBatch("morning");
      setPreferredLocation(turf.location);
      setDealNotes("");
      setNightUnlocked(false);
    }
  }, [turf]);

  if (!turf) return null;

  const notify = async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg?.showNotification) {
      reg.showNotification("Sports spitch booking pending", {
        body: `Your booking at ${turf.name} is pending confirmation.`,
        icon: "/icon-192.png",
      });
    } else {
      new Notification("Sports spitch booking pending", {
        body: `Your booking at ${turf.name} is pending confirmation.`,
        icon: "/icon-192.png",
      });
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name || !phone || !datetime) {
      alert("Please fill in all required fields (name, phone, and date/time)");
      return;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    // Validate datetime
    const dateObj = new Date(datetime);
    if (isNaN(dateObj.getTime())) {
      alert("Please enter a valid date and time");
      return;
    }

    try {
      // Try to add booking via API if available, otherwise fall back to local store
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            phone,
            game: turf.sport,
            date: datetime.split('T')[0],
            timeSlot: `${dateObj.getHours()}-${dateObj.getHours() + 1}`,
            players: players.toString(),
          }),
        });

        if (response.ok) {
          console.log("Booking submitted via API successfully");
        } else {
          console.warn("API submission failed, using local store fallback");
        }
      } catch (apiError) {
        console.warn("API not available, using local store:", apiError);
      }

      // Always save to local store as backup
      addBooking({
        name,
        phone,
        email,
        turf: turf.name,
        sport: turf.sport,
        datetime,
        players,
        price: turf.price,
        batch,
        preferredLocation: preferredLocation || turf.location,
        dealNotes,
      });
      
      console.log("Booking saved successfully");
      setDone(true);
      notify();
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert(`Error saving booking: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4 bg-background/70 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
      <div className="w-full max-w-md glass-card neon-border rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 p-2 rounded-lg hover:bg-surface sticky">
          <X className="size-4" />
        </button>

        {done ? (
          <div className="text-center py-6">
            <CheckCircle2 className="size-14 text-success mx-auto mb-3" />
            <h3 className="text-xl font-bold">Booking submitted!</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Your booking is <span className="text-warning font-semibold">pending</span> confirmation. The venue will update your status shortly.
            </p>
            <button onClick={onClose} className="mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold w-full">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-full bg-primary/10 p-2">
                <MapPin className="size-4 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Book {turf.name}</h3>
                <p className="text-sm text-muted-foreground">{turf.sport} · ₹{turf.price}/hr</p>
              </div>
            </div>

            <a href={`https://www.google.com/maps/search/${encodeURIComponent(turf.location)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-medium text-primary-glow hover:underline mb-4">
              View turf location on Google Maps
            </a>

            <form onSubmit={onSubmit} className="mt-1 space-y-3">
              <Field label="Full name">
                <input required value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your name" />
              </Field>
              <Field label="Phone">
                <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="9XXXXXXXXX" pattern="[0-9]{10}" />
              </Field>
              <Field label="Email">
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="your@email.com" />
              </Field>
              <Field label="Preferred location">
                <input value={preferredLocation} onChange={(e) => setPreferredLocation(e.target.value)} className="input" placeholder="Preferred location" />
              </Field>
              <Field label="Deal details">
                <textarea value={dealNotes} onChange={(e) => setDealNotes(e.target.value)} className="input min-h-[5rem] resize-none" placeholder="Add any booking instructions or deal details" />
              </Field>
              <Field label="Date & time">
                <input required type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} className="input" />
              </Field>
              <Field label="Batch">
                <div className="grid grid-cols-3 gap-2">
                  {BATCHES.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setBatch(item.value)}
                      disabled={item.value === "night" && !nightUnlocked}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${batch === item.value ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"} ${item.value === "night" && !nightUnlocked ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/10"}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                {!nightUnlocked && (
                  <button type="button" onClick={() => setNightUnlocked(true)} className="mt-2 text-xs text-primary-glow hover:underline">
                    Unlock night batch
                  </button>
                )}
              </Field>
              <Field label="Number of players">
                <input required type="number" min={1} max={30} value={players} onChange={(e) => setPlayers(+e.target.value)} className="input" />
              </Field>

              <button type="submit" className="w-full mt-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold shadow-[var(--shadow-glow)]">
                Book now
              </button>
            </form>
          </>
        )}
      </div>

      <style>{`.input{width:100%;background:var(--surface);border:1px solid var(--border);border-radius:.75rem;padding:.625rem .75rem;font-size:.875rem;outline:none}.input:focus{border-color:color-mix(in oklab, var(--primary) 60%, transparent)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
