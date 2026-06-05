import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/logo-brand.png";

export function Footer() {
  return (
    <footer className="border-t border-border mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground flex justify-between flex-wrap gap-2">
          <div>© 2026 Sports pitch. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span>Developed by </span>
            <a href="https://www.cubecorpsol.com/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">
              Cube Corpsol
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
