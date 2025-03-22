import type { Connection } from "home-assistant-js-websocket";

declare global {
  interface Window {
    hassConnection: Promise<{
      conn: Connection;
    }>;
  }
}

export type HassEvent =
  | LovelaceUpdatedEvent
  | BrowserReloadEvent
  | ComponentVisibilityChangeRequestedEvent;

export type LovelaceUpdatedEvent = {
  event_type: "lovelace_updated";
  data: {
    url_path: string;
  };
};

export type BrowserReloadEvent = {
  event_type: "browser_reload_requested";
  data: {
    browser_id: string;
  };
};

export type ComponentVisibilityChangeRequestedEvent = {
  event_type: "component_visibility_change_requested";
  data: {
    visible?: boolean;
    browser_id: string;
  };
};
