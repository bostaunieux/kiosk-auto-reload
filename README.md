# Kiosk Auto Reload

Automatically reload Home Assistant dashboards on configuration change

![Auto-reload Preview](https://github.com/user-attachments/assets/d5690f1d-a91e-4db0-8f0f-1a34a9435420)

## How It Works

Home Assistant fires an event whenever a dashboard configuration is changed. This plugin listens for these events and automatically triggers a browser reload for any dashboard loaded in a browser window with the auto reload option enabled. Auto reload is enabled via a query string parameter added to the dashboard URL.

## Installation

### HACS

This plugin is available in HACS (Home Assistant Community Store)

1. Open HACS within your Home Assistant instance
2. Select the More Options menu (top right icon) and open "Custom repositories"
3. Add this repository:
   - Repository: https://github.com/bostaunieux/kiosk-auto-reload
   - Type: Dashboard
4. Close the dialog and search for "Kiosk auto-reload"
5. Click the Download button

### Manual

1. Download the `kiosk-auto-reload.js` file from the [latest release](https://github.com/bostaunieux/kiosk-auto-reload/releases)
2. Copy the `kiosk-auto-reload.js` file into your config/www folder
3. Add the script as a resource in your Home Assistant instance
   1. From the UI, navigate to Settings > Dashboards > More Options (top right icon) > Resources > Add Resource
   2. Add the resource:
      - Url: `/local/kiosk-auto-reload.js`
      - Resource type: JavaScript Module
   - Note: If the Resources menu is not available, verify you have enabled Advanced Mode in your User Profile

## How To Use

### Auto reload a dashboard

Any dashboard with the `auto_reload` query string parameter will listen for configuration changes and reload after 5 seconds.

To verify this works:

1. Open the same dashboard in two browser windows side by side - one with the auto reload option and one without. Example:
   - Window A: http://homeassistant.local:8123/dashboard-main
   - Window B: http://homeassistant.local:8123/dashboard-main?auto_reload=true
2. In Window A, make a change to the dashboard, such as adding, deleting or modifying a card
3. Observe Window B will automatically reload when the change is made

Two options exist for configuring the browser reload behavior:

1. Reload with a 5 second delay - use `auto_reload=true`
2. Reload immediately - use `auto_reload=immediate`

> IMPORTANT: Do not try to edit a dashboard in a browser window with the `auto_reload` query string parameter. Doing so will trigger the window to reload on every edit.

### Manually trigger a dashboard reload

For cases where you want to programatically trigger a reload without requiring a config change, you can fire a custom event.

![Manual Reload Preview](https://github.com/user-attachments/assets/c640960a-a84b-4de9-a2da-d4c7696f57a1)

To enable, load a dashboard with the `browser_id` query string parameter (with or without the `auto_reload` option) and give it a unique name, such as http://homeassistant.local:8123/dashboard-main?auto_reload=true&browser_id=kitchen

To verify this works:

1. In the Developer Tools > Events page, enter `browser_reload_requested` for the Event type with Event data set to:
   ```
   browser_id: <my-unique-browser-id>
   ```
2. Select `Fire Event`

Example

<img src="https://github.com/user-attachments/assets/5377371f-9fcb-43a4-b0e1-b9ce03683af7" width="400px" />

### To trigger via a dashboard button

1. Create a custom [Input Button](https://www.home-assistant.io/integrations/input_button/) helper, such as `input_button.reload_kitchen_dashboard`
2. Create an automation to watch for the button trigger and fire the browser reload event
   ```
   alias: "Button: Reload Dashboard"
   description: ""
   trigger:
     - platform: state
       entity_id:
         - input_button.reload_kitchen_dashboard
   condition: []
   action:
     - event: browser_reload_requested
       event_data:
         browser_id: kitchen
   mode: single
   ```
