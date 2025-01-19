# Kiosk Auto Reload

Automatically reload Home Assistant dashboards on configuration change

## How It Works

Home Assistant fires an event whenever a configuration change is saved. This script subscribes to these events, filters to those that apply to the currently-loaded dashboard and then additionally only triggers for browser instances configured to auto-reload via a query string parameter.

1. Add the plugin to Home Assistant
2. Load a dashboard with the `auto_reload` query string parameter, such as http://homeassistant.local:8123/dashboard-main?auto_reload=true
3. In a separate browser window (on the same device or a different one), load the same dashboard without the query string parameter, e.g. http://homeassistant.local:8123/dashboard-main, then modify and save the configuration
4. The initial dashboard with automaticaly reload


## Manually trigger a dashboard reload

For cases where you want to programatically trigger a reload without requiring a config change, you can fire a custom event.

To enable, load a dashboard with the `browser_id` query string parameter (with or without `auto_reload`), such as http://homeassistant.local:8123/dashboard-main?auto_reload=true&browser_id=kitchen

### Debug setup

1. In the Event tab of Developer Tools, enter `browser_reload_requested` for the Event type with Event data set to:

   ```
   browser_id: kitchen
   ```

2. Select `Fire Event`


### To use via a dashboard button

1. Create a custom [Input Button](https://www.home-assistant.io/integrations/input_button/), such as `input_button.reload_kitchen_dashboard`
2. Create an automation to watch for the button trigger and fire the browser reload event
    ```
    alias: "Button: Reload Kitchen Dashboard"
    mode: single
    triggers:
      - entity_id:
        - input_button.reload_kitchen_dashboard
      trigger: state
    actions:
      - event: browser_reload_requested
        event_data:
          browser_id: kitchen
    ```
