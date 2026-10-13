# Service Worker Popup Capability Delegation Demo

This sample demonstrates **Popup Capability Delegation** from a Service Worker to a controlled window client via `client.postMessage(message, {delegate: 'popup'})`.

## Background & Specifications

- **ChromeStatus Feature**: [5091965583622144](https://chromestatus.com/feature/5091965583622144)
- **Chromium Tracking Bug**: [crbug.com/542314185](https://crbug.com/542314185)
- **Specification Explainer**: [WICG Popup Delegation Explainer](https://github.com/WICG/capability-delegation/blob/main/explainers/popup-delegation.md)
- **Minimum Chrome Version**: Chrome 157+ (Gated behind `--enable-experimental-web-platform-features` / `chrome://flags/#enable-experimental-web-platform-features`)

## What Problem Does This Solve?

Historically, when a Service Worker handled a Web Notification click (`notificationclick`), its only mechanism to present content was `clients.openWindow(url)`. This always opened a full new browser tab, disrupting user workflows when an auxiliary popup window (e.g. quick reply, mini-player, line-item inspector) was desired.

Direct calls to `window.open()` from a controlled page inside `navigator.serviceWorker.onmessage` were rejected by the browser popup blocker because the page lacked a user activation token.

**Popup Capability Delegation** allows the Service Worker handling `notificationclick` to delegate its transient user activation to an existing window client via `client.postMessage(msg, {delegate: 'popup'})`. The client can then call `window.open()` without triggering the popup blocker, and synchronously share JavaScript memory with the popup via `window.opener`.

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
# Navigate to the sample directory
cd /usr/local/google/home/dmurph/projects/samples/service-worker/capability-delegation-popup

# Start a local HTTP server
python3 -m http.server 8000
```

Then launch Chrome with experimental web platform features:

```bash
google-chrome --enable-experimental-web-platform-features http://localhost:8000/
```

1. Click **"Request Notification Permission"** and grant notification permissions.
2. Click **"Primary Demo: Delegate Popup on Click"**.
3. Click the resulting OS notification banner.
4. Observe the auxiliary preview window open and verify shared opener state.
