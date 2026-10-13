/**
 * Service Worker for Popup Capability Delegation Demo
 * ChromeStatus: 5091965583622144 | crbug.com/542314185
 */

function runProbe(client) {
  let delegateRead = false;
  try {
    client.postMessage({type: 'probe-response'}, {
      get delegate() {
        delegateRead = true;
        return 'popup';
      }
    });
    if (!delegateRead) {
      client.postMessage({
        type: 'probe-status',
        status: 'Unsupported (< M157, delegate option ignored)'
      });
    } else {
      client.postMessage({
        type: 'probe-status',
        status: 'Unexpectedly succeeded without activation'
      });
    }
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      client.postMessage({
        type: 'probe-status',
        status: 'Enabled'
      });
    } else if (err.name === 'NotSupportedError') {
      client.postMessage({
        type: 'probe-status',
        status: 'Flag disabled (NotSupportedError)'
      });
    } else if (!delegateRead) {
      client.postMessage({
        type: 'probe-status',
        status: 'Unsupported (< M157, delegate option ignored)'
      });
    } else {
      client.postMessage({
        type: 'probe-status',
        status: `Error (${err.name}: ${err.message})`
      });
    }
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.clients.claim();
    const windowClients = await self.clients.matchAll({type: 'window'});
    for (const client of windowClients) {
      client.postMessage({
        type: 'sw-status',
        status: 'Active & controlling'
      });
      runProbe(client);
    }
  })());
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') {
    return;
  }

  if (data.type === 'probe') {
    if (event.source) {
      runProbe(event.source);
    }
    return;
  }

  // SW postMessage({delegate: 'popup'}) without user activation
  if (data.type === 'trigger-without-activation') {
    const client = event.source;
    if (!client) {
      return;
    }
    try {
      client.postMessage(
        {type: 'open-popup', scenario: 'no-activation'},
        {delegate: 'popup'}
      );
      client.postMessage({
        type: 'log-result',
        scenario: 'no-activation',
        outcome: 'unexpected-success',
        errorMessage: 'postMessage({delegate: "popup"}) unexpectedly succeeded without activation'
      });
    } catch (err) {
      client.postMessage({
        type: 'log-result',
        scenario: 'no-activation',
        outcome: 'threw',
        errorName: err.name,
        errorMessage: err.message
      });
    }
    return;
  }

  // Schedule an OS notification for the user to click
  if (data.type === 'show-notification') {
    const scenario = data.scenario || 'delegate-popup';
    const focusFirst = Boolean(data.focusFirst);
    const caseTitle = data.caseTitle || `[${scenario}]`;
    const optionsText = data.optionsText || '(none)';

    const title = caseTitle;
    const options = {
      body: optionsText,
      tag: `cap-del-${scenario}-${Date.now()}`,
      data: {
        scenario: scenario,
        focusFirst: focusFirst,
        caseTitle: caseTitle,
        optionsText: optionsText
      }
    };

    event.waitUntil((async () => {
      await self.registration.showNotification(title, options);
      if (event.source) {
        event.source.postMessage({
          type: 'notification-shown',
          scenario: scenario,
          title: title
        });
      }
    })());
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil((async () => {
    const notificationData = event.notification.data || {};
    const scenario = notificationData.scenario || 'delegate-popup';
    const focusFirst = Boolean(notificationData.focusFirst);
    const payload = {
      caseTitle: notificationData.caseTitle || `[${scenario}]`,
      scenario: scenario,
      optionsText: notificationData.optionsText || '',
      timestamp: Date.now()
    };

    const clientList = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: false
    });

    let targetClient = null;
    if (clientList.length > 0) {
      targetClient = clientList.find((client) => client.focused) || clientList[0];
    }

    if (!targetClient) {
      if (self.clients.openWindow) {
        await self.clients.openWindow('index.html?fallback=openWindow');
      }
      return;
    }

    if (focusFirst) {
      await targetClient.focus();
    }

    switch (scenario) {
      case 'delegate-popup': {
        try {
          targetClient.postMessage(
            {type: 'open-popup', scenario: 'delegate-popup', payload: payload},
            {delegate: 'popup'}
          );
        } catch (err) {
          targetClient.postMessage({
            type: 'log-result',
            scenario: 'delegate-popup',
            outcome: 'threw',
            errorName: err.name,
            errorMessage: err.message
          });
        }
        break;
      }

      case 'control-no-delegation': {
        targetClient.postMessage(
          {type: 'open-popup', scenario: 'control-no-delegation', payload: payload}
        );
        break;
      }

      case 'double-open': {
        try {
          targetClient.postMessage(
            {type: 'open-popup', scenario: 'double-open', payload: payload},
            {delegate: 'popup'}
          );
        } catch (err) {
          targetClient.postMessage({
            type: 'log-result',
            scenario: 'double-open',
            outcome: 'threw',
            errorName: err.name,
            errorMessage: err.message
          });
        }
        break;
      }

      case 'double-postmessage': {
        try {
          targetClient.postMessage(
            {type: 'open-popup', scenario: 'double-postmessage', payload: payload},
            {delegate: 'popup'}
          );
        } catch (err) {
          targetClient.postMessage({
            type: 'log-result',
            scenario: 'double-postmessage',
            outcome: 'threw',
            errorName: err.name,
            errorMessage: err.message
          });
          break;
        }

        try {
          targetClient.postMessage(
            {type: 'open-popup', scenario: 'double-postmessage-2', payload: payload},
            {delegate: 'popup'}
          );
          targetClient.postMessage({
            type: 'log-result',
            scenario: 'double-postmessage',
            outcome: 'unexpected-success',
            errorMessage: 'Second postMessage unexpectedly succeeded'
          });
        } catch (err) {
          targetClient.postMessage({
            type: 'log-result',
            scenario: 'double-postmessage',
            outcome: 'threw',
            errorName: err.name,
            errorMessage: err.message
          });
        }
        break;
      }

      case 'expired-token': {
        try {
          targetClient.postMessage(
            {type: 'open-popup', scenario: 'expired-token', payload: payload},
            {delegate: 'popup'}
          );
        } catch (err) {
          targetClient.postMessage({
            type: 'log-result',
            scenario: 'expired-token',
            outcome: 'threw',
            errorName: err.name,
            errorMessage: err.message
          });
        }
        break;
      }

      case 'unsupported-capability': {
        try {
          targetClient.postMessage(
            {type: 'open-popup', scenario: 'unsupported-capability', payload: payload},
            {delegate: 'fullscreen'}
          );
          targetClient.postMessage({
            type: 'log-result',
            scenario: 'unsupported-capability',
            outcome: 'unexpected-success',
            errorMessage: 'postMessage with unsupported capability unexpectedly succeeded'
          });
        } catch (err) {
          targetClient.postMessage({
            type: 'log-result',
            scenario: 'unsupported-capability',
            outcome: 'threw',
            errorName: err.name,
            errorMessage: err.message
          });
        }
        break;
      }

      default: {
        try {
          targetClient.postMessage(
            {type: 'open-popup', scenario: scenario, payload: payload},
            {delegate: 'popup'}
          );
        } catch (err) {
          targetClient.postMessage({
            type: 'log-result',
            scenario: scenario,
            outcome: 'threw',
            errorName: err.name,
            errorMessage: err.message
          });
        }
        break;
      }
    }
  })());
});
