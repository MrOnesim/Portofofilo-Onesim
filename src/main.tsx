import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

if ("serviceWorker" in navigator) {
  void navigator.serviceWorker
    .getRegistrations()
    .then((registrations) =>
      Promise.all(registrations.map((registration) => registration.unregister())),
    )
    .catch((error: unknown) => {
      console.error("Failed to unregister service workers:", error);
    });
}

if ("caches" in window) {
  void window.caches
    .keys()
    .then((cacheNames) =>
      Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName))),
    )
    .catch((error: unknown) => {
      console.error("Failed to clear Cache Storage:", error);
    });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
