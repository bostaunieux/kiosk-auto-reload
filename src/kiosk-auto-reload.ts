import type { HassEvent } from "./types";
import onLovelaceUpdated, { AUTO_RELOAD_PARAM } from "./on-lovelace-updated";
import onBrowserReloadRequested, { BROWSER_ID_PARAM } from "./on-browser-reload-requested";
import toggleComponentVisibility, {
  HIDE_COMPONENTS_PARAM,
  onComponentVisibilityChangeRequested,
} from "./component-visibility-toggler";
import { version } from "../package.json";

const bootstrapEventListener = () => {
  if (!window.hassConnection) {
    console.debug("hassConnection not defined; will retry in 2 seconds");
    setTimeout(bootstrapEventListener, 2000);
    return;
  }

  window.hassConnection.then((hass) =>
    hass.conn.subscribeEvents<HassEvent>((ev) => {
      switch (ev.event_type) {
        case "lovelace_updated":
          return onLovelaceUpdated(ev);
        case "browser_reload_requested":
          return onBrowserReloadRequested(ev);
        case "component_visibility_change_requested":
          return onComponentVisibilityChangeRequested(ev);
      }
    }),
  );
};

const searchParams = new URLSearchParams(window.location.search);

if (searchParams.has(BROWSER_ID_PARAM) || searchParams.has(AUTO_RELOAD_PARAM)) {
  bootstrapEventListener();
}

if (searchParams.has(HIDE_COMPONENTS_PARAM)) {
  toggleComponentVisibility();
}

console.info(
  `🪨 %cKIOSK AUTO RELOAD ${version} is installed`,
  "color: lightblue; font-weight: bold",
);
