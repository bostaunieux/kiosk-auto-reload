import type { Connection } from "home-assistant-js-websocket";


export {};

declare global {
  interface Window {
    hassConnection: Promise<{
      conn: Connection;
    }>;
  }
}

type HassEvent = LovelaceUpdatedEvent | BrowserReloadEvent

type LovelaceUpdatedEvent = {
  event_type: 'lovelace_updated';
  data: {
    url_path: string;
  };
}  

type BrowserReloadEvent = {
  event_type: 'browser_reload_requested';
  data: {
    browser_id: string;
  };
}  


const kioskAutoReload = () => {
  
  if (!window.hassConnection) {
    console.debug("hassConnection not defined; will retry in 2 seconds");
    setTimeout(kioskAutoReload, 2000);
    return;
  }

  window.hassConnection.then((hass) =>
    hass.conn.subscribeEvents<HassEvent>((ev) => {
      switch (ev.event_type) {
        case "lovelace_updated":
          return handleLovelaceUpdated(ev);
        case "browser_reload_requested":
          return handleBrowserRefreshRequested(ev);
      }
    }),
  );
};

const handleLovelaceUpdated = (ev: LovelaceUpdatedEvent) => {
  // skip reload if kiosk mode is not set in query string
  if (new URLSearchParams(window.location.search).get("kiosk") == null) {
    return;
  }
  // skip reload if the update event does not match the current dashboard
  if (!window.location.pathname.startsWith(`/${ev.data.url_path}`)) {
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

const handleBrowserRefreshRequested = (ev: BrowserReloadEvent) => {
  // skip reload if the update event does not match the current browser id
  const browserId = new URLSearchParams(window.location.search).get("browser_id");
  if (browserId == null || ev.data?.browser_id !== browserId) {
    return;
  }

  console.debug("Browser reload request, auto-reloading...");

  window.location.reload();
};

kioskAutoReload();
