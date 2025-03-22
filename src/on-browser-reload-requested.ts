import type { BrowserReloadEvent } from "./types";

export const BROWSER_ID_PARAM = "browser_id";

const onBrowserReloadRequested = (ev: BrowserReloadEvent) => {
  // skip reload if the update event does not match the current browser id
  const browserId = new URLSearchParams(window.location.search).get(BROWSER_ID_PARAM);
  if (browserId == null || ev.data?.browser_id !== browserId) {
    return;
  }

  console.debug("Browser reload request, auto-reloading...");

  window.location.reload();
};

export default onBrowserReloadRequested;
