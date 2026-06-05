import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { isAdmin } from "@/lib/booking-store";

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate({ to: "/admin/login" });
    }
  }, [navigate]);

  if (!isAdmin()) {
    return null;
  }

  return <>{children}</>;
}
