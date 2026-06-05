import logoImg from "@/assets/logo-brand.png";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${scrolled ? 'bg-background/90 border-b border-border' : 'bg-transparent border-none'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logoImg} alt="Sports Pitch" className="h-28 w-auto max-h-28 sm:h-32 sm:max-h-32 object-contain object-left" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {links.map((l) => (
            <Link key={l.label} to={l.to} activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }} className="hover:text-foreground transition">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-surface" aria-label="Menu">
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border px-4 py-3 space-y-2 bg-background/90 backdrop-blur-xl">
          {links.map((l) => (
            <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="block py-2 text-sm text-muted-foreground">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
