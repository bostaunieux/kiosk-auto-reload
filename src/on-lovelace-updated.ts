import type { LovelaceUpdatedEvent } from "./types";

export const AUTO_RELOAD_PARAM = "auto_reload";

const onLovelaceUpdated = (ev: LovelaceUpdatedEvent) => {
  // skip reload if reload param is not set in query string
  const reloadParam = new URLSearchParams(window.location.search).get(AUTO_RELOAD_PARAM);
  if (reloadParam == null) {
    return;
  }
  // skip reload if the update event does not match the current dashboard
  if (!window.location.pathname.startsWith(`/${ev.data.url_path}`)) {
    return;
  }

  // reload immediately if the "immediate" flag is present
  if (reloadParam === "immediate") {
    window.location.reload();
    return;
  }

  console.debug("Dashboard has updated, auto-reloading in 5 seconds...");

  const ha = document.querySelector("home-assistant");
  ha?.dispatchEvent(
    new CustomEvent("hass-notification", {
      detail: {
        message: "Dashboard has updated, auto-reloading in 5 seconds...",
        duration: 5000,
      },
    }),
  );

  setTimeout(() => {
    window.location.reload();
  }, 5000);
};

export default onLovelaceUpdated;
