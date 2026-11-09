import { ComponentVisibilityChangeRequestedEvent, HomeAssistantElement } from "./types";
import { BROWSER_ID_PARAM } from "./on-browser-reload-requested";
import { waitForElement } from "./utils";

export const HIDE_COMPONENTS_PARAM = "auto_hide_nav";

// HA 2026.6 (frontend #51990) replaced the MDC drawer and renamed its width variable
const SIDEBAR_WIDTH_VAR = "--ha-sidebar-width";
const LEGACY_SIDEBAR_WIDTH_VAR = "--mdc-drawer-width";

let headerDisplay: string | null = null;
let sideBarDisplay: string | null = null;
let headerHeight: string | null = null;

/**
 * Returns the CSS variable(s) controlling the sidebar width for the running HA version.
 * If the version can't be determined, both are returned; setting an unused variable is harmless.
 */
const getSidebarWidthVars = (hass: HTMLElement): string[] => {
  const version = (hass as HomeAssistantElement).hass?.config?.version;
  const match = version?.match(/^(\d+)\.(\d+)/);
  if (!match) {
    return [SIDEBAR_WIDTH_VAR, LEGACY_SIDEBAR_WIDTH_VAR];
  }

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const usesNewDrawer = major > 2026 || (major === 2026 && minor >= 6);
  return [usesNewDrawer ? SIDEBAR_WIDTH_VAR : LEGACY_SIDEBAR_WIDTH_VAR];
};

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

  const sidebarWidthVars = getSidebarWidthVars(hass);

  if (visible) {
    if (initialRun || sideBarDisplay == null || headerDisplay == null) {
      return;
    }

    // drawer width is set by HA's own styles, so just unset our override
    sidebarWidthVars.forEach((v) => main.style.removeProperty(v));
    main.style.setProperty("--header-height", headerHeight);

    sidebar.style.display = sideBarDisplay;
    header.style.display = headerDisplay;
  } else {
    sidebarWidthVars.forEach((v) => main.style.setProperty(v, "0px"));
    main.style.setProperty("--header-height", "0px");

    sidebar.style.display = "none";
    header.style.display = "none";
  }
};

export default toggleComponentVisibility;
