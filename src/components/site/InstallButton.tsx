import { Download } from "lucide-react";
import { useEffect, useState } from "react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallButton({ className, label = "Install app" }: { className?: string; label?: string }) {
  const [prompt, setPrompt] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setPrompt(e as BIPEvent); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onClick = async () => {
    if (!prompt) {
      alert("To install: open your browser menu and choose 'Install app' or 'Add to Home Screen'.");
      return;
    }
    await prompt.prompt();
    setPrompt(null);
  };

  if (installed) return null;

  return (
    <button onClick={onClick} className={className ?? "inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold shadow-[var(--shadow-glow)] hover:opacity-90 transition"}>
      <Download className="size-4" /> {label}
    </button>
  );
}
