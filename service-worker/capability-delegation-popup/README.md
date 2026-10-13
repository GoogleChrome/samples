# Service Worker Popup Capability Delegation Demo

[**Live Demo**](https://googlechrome.github.io/samples/service-worker/capability-delegation-popup/index.html)

This sample demonstrates **Popup Capability Delegation** from a Service Worker to a controlled window client via `client.postMessage(message, {delegate: 'popup'})`.

## Background & Specifications

- **ChromeStatus Feature**: [5091965583622144](https://chromestatus.com/feature/5091965583622144)
- **Chromium Tracking Bug**: [crbug.com/542314185](https://crbug.com/542314185)
- **Specification Explainer**: [WICG Popup Delegation Explainer](https://github.com/WICG/capability-delegation/blob/main/explainers/popup-delegation.md)
- **Standards Discussion & Feedback**: [WICG Issue #42](https://github.com/WICG/capability-delegation/issues/42)
- **Minimum Chrome Version**: Chrome 157+ (Gated behind `--enable-experimental-web-platform-features` / `chrome://flags/#enable-experimental-web-platform-features`)

## What Problem Does This Solve?

Historically, when a Service Worker handled a Web Notification click (`notificationclick`), its only mechanism to present content was `clients.openWindow(url)`. This always opened a full new browser tab, disrupting user workflows when an auxiliary popup window (e.g. quick reply, mini-player, line-item inspector) was desired.

Direct calls to `window.open()` from a controlled page inside `navigator.serviceWorker.onmessage` were rejected by the browser popup blocker because the page lacked a user activation token.

**Popup Capability Delegation** allows the Service Worker handling `notificationclick` to delegate its transient user activation to an existing window client via `client.postMessage(msg, {delegate: 'popup'})`. The client can then call `window.open()` without triggering the popup blocker, and synchronously share JavaScript memory with the popup via `window.opener`.

## DevTrial Quick-Start / HOWTO

### 1. Enable the Feature Flag

In Chrome 157 or newer:
- Navigate to `chrome://flags/#enable-experimental-web-platform-features` and set it to **Enabled**, or
- Launch Chrome from the command line with:
  ```bash
  google-chrome --enable-experimental-web-platform-features
  # or specifically:
  google-chrome --enable-features=CapabilityDelegationPopup
  ```

### 2. End-to-End Implementation Pattern

#### Service Worker (`service-worker.js`)

```javascript
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const clientList = await self.clients.matchAll({type: 'window'});
    if (clientList.length > 0) {
      // 1. Focus existing window (optional; AllowWindowInteraction is decoupled from popup token)
      await clientList[0].focus();

      // 2. Delegate popup capability token via postMessage
      try {
        clientList[0].postMessage(
          {type: 'open-popup', payload: event.notification.data},
          {delegate: 'popup'}
        );
      } catch (err) {
        // Fallback if popup capability delegation is unsupported in the browser
        if (self.clients.openWindow) {
          await self.clients.openWindow('index.html');
        }
      }
    } else if (self.clients.openWindow) {
      // Fallback when no client window is currently open
      await self.clients.openWindow('index.html?fallback=openWindow');
    }
  })());
});
```

#### Window Client (`script.js`)

```javascript
navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data?.type === 'open-popup') {
    // 1. Share state directly with auxiliary window
    window.lastDelegatedMessage = event.data.payload;

    // 2. Open auxiliary popup without popup blocker obstruction
    const popup = window.open('popup.html', '_blank', 'width=540,height=620');
  }
});
```

### 3. Feedback & Bug Reports

- File specification feedback and design questions on the [WICG Capability Delegation issue tracker](https://github.com/WICG/capability-delegation/issues/42).
- Report Chromium implementation bugs on the Chromium Issue Tracker under [crbug.com/542314185](https://crbug.com/542314185).

## Key Capabilities & Security Invariants Tested

1. **Primary Delegation**: Service Worker delegates `'popup'` to an existing window client upon `notificationclick`. Client successfully opens an auxiliary popup.
2. **Decoupled Window Interaction**: Calling `await client.focus()` before delegating popup does *not* consume the popup delegation token (`AllowWindowInteraction` is decoupled).
3. **Synchronous State Sharing**: The opened popup window reads `window.opener.lastDelegatedMessage` directly without requiring IPC re-serialization or network refetching.
4. **Negative Control**: Sending `postMessage` without `{delegate: 'popup'}` results in `window.open()` being blocked by the popup blocker.
5. **Single-Use Receiver Token**: The delegated activation token can only be consumed once. A second consecutive call to `window.open()` is blocked.
6. **Single-Use Sender Token**: The Service Worker's delegation token is consumed upon first delegation. An immediate second `client.postMessage(..., {delegate: 'popup'})` within the same notification click throws `NotAllowedError`.
7. **Token Expiration**: The delegated receiver token expires after the standard transient activation window (~1000ms). Calling `window.open()` after 1500ms is blocked.
8. **No Activation Required for Security Check**: Calling `client.postMessage(..., {delegate: 'popup'})` without an active `notificationclick` user activation throws `NotAllowedError`.
9. **Capability Restriction**: Attempting to delegate unsupported capabilities (e.g. `{delegate: 'fullscreen'}`) in `client.postMessage` throws `NotSupportedError`.
10. **Sender Type Restriction**: Calling `window.postMessage(msg, {targetOrigin: '*', delegate: 'popup'})` throws `NotSupportedError` because `'popup'` delegation is only supported from Service Worker clients.

## Running Locally

To run and test the sample locally:

```bash
# Clone the repository and navigate to the sample directory
git clone https://github.com/GoogleChrome/samples.git
cd samples/service-worker/capability-delegation-popup

# Start a local HTTP server
python3 -m http.server 8000
```

Then launch Chrome with experimental web platform features:

```bash
google-chrome --enable-experimental-web-platform-features http://localhost:8000/
```

1. Click **"Request permission"** and grant notification permissions.
2. Click **"Primary Demo: Delegate Popup on Click"**.
3. Click the resulting OS notification banner.
4. Observe the auxiliary preview window open and verify shared opener state.
