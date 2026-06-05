import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export function NotificationButton() {
  const [permission, setPermission] = useState<string>("default");

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
  }, []);

  const onClick = async () => {
    if (typeof Notification === "undefined") {
      alert("Notifications are not supported in this browser.");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      const message = "Sports spitch notifications enabled. You'll see alerts and updates.";
      if (navigator.serviceWorker) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.showNotification) {
          registration.showNotification("Sports spitch enabled", {
            body: message,
            icon: "/icon-192.png",
          });
          return;
        }
      }
      new Notification("Sports spitch enabled", { body: message, icon: "/icon-192.png" });
    }
  };

  if (permission === "granted") {
    return null;
  }

  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold shadow-[var(--shadow-glow)] hover:opacity-90 transition">
      <Bell className="size-4" /> Enable notifications
    </button>
  );
}
