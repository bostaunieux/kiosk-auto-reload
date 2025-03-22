import { ComponentVisibilityChangeRequestedEvent } from "./types";
import { BROWSER_ID_PARAM } from "./on-browser-reload-requested";
import { waitForElement } from "./utils";

export const HIDE_COMPONENTS_PARAM = "auto_hide_nav";

let headerDisplay: string | null = null;
let sideBarDisplay: string | null = null;
let headerHeight: string | null = null;

export const onComponentVisibilityChangeRequested = (
  ev: ComponentVisibilityChangeRequestedEvent,
) => {
  // skip reload if the update event does not match the current browser id
  const browserId = new URLSearchParams(window.location.search).get(BROWSER_ID_PARAM);
  if (browserId == null || ev.data?.browser_id !== browserId) {
    return;
  }

  const visible = ev.data.visible;
  toggleComponentVisibility(visible);
};

const toggleComponentVisibility = async (visible?: boolean) => {
  const hass = await waitForElement("home-assistant");
  if (!hass?.shadowRoot) {
    return;
  }

  const main = await waitForElement("home-assistant-main", hass.shadowRoot);
  if (!main?.shadowRoot) {
    return;
  }
  const sidebar = await waitForElement("ha-sidebar", main.shadowRoot);
  const panel = await waitForElement("ha-panel-lovelace", main.shadowRoot);
  if (!panel?.shadowRoot) {
    return;
  }
  const panelRoot = await waitForElement("hui-root", panel.shadowRoot);
  const header = panelRoot?.shadowRoot?.querySelector<HTMLElement>(".header");

  if (!main || !sidebar || !header) {
    return;
  }

  // if this is the first time we're running, calculate and store the initial settings
  const initialRun = headerDisplay == null;
  if (initialRun) {
    headerHeight = window.getComputedStyle(main).getPropertyValue("--header-height");
    headerDisplay = window.getComputedStyle(header).getPropertyValue("display");
    sideBarDisplay = window.getComputedStyle(sidebar).getPropertyValue("display");
  }

  if (visible) {
    if (initialRun || sideBarDisplay == null || headerDisplay == null) {
      return;
    }

    // drawer width is set on the html element, so just unset our override
    main.style.removeProperty("--mdc-drawer-width");
    main.style.setProperty("--header-height", headerHeight);

    sidebar.style.display = sideBarDisplay;
    header.style.display = headerDisplay;
  } else {
    main.style.setProperty("--mdc-drawer-width", "0px");
    main.style.setProperty("--header-height", "0px");

    sidebar.style.display = "none";
    header.style.display = "none";
  }
};

export default toggleComponentVisibility;
