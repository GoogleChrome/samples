/**
 * Service Worker Popup Capability Delegation Demo Script
 * ChromeStatus: 5091965583622144 | crbug.com/542314185
 */

let serviceWorkerRegistration = null;

const SCENARIO_LABELS = {
  'delegate-popup': 'Primary Demo',
  'control-no-delegation': 'Control: No Delegation',
  'double-open': 'Single-Use Receiver Token',
  'double-postmessage': 'Single-Use Sender Token',
  'expired-token': 'Expired Receiver Token (1.5s delay)',
  'unsupported-capability': 'Unsupported Capability (fullscreen)'
};

function formatTimestamp() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const millis = String(date.getMilliseconds()).padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${millis}`;
}

function logEvent(tag, message) {
  const container = document.getElementById('logContainer');
  const line = `[${formatTimestamp()}] [${tag}] ${message}\n`;
  if (container) {
    container.textContent += line;
  }
}

function updateNotificationPermissionUI() {
  const permissionElement = document.getElementById('notifPermissionText');
  if (!('Notification' in window)) {
    if (permissionElement) {
      permissionElement.textContent = 'Unsupported';
    }
    return;
  }

  if (permissionElement) {
    permissionElement.textContent = Notification.permission;
  }
}

async function registerServiceWorker() {
  const swStatusElement = document.getElementById('swStatusText');
  const featureElement = document.getElementById('featureSupportText');

  if (!('serviceWorker' in navigator)) {
    if (swStatusElement) {
      swStatusElement.textContent = 'Not Supported';
    }
    if (featureElement) {
      featureElement.textContent = 'Unavailable';
    }
    logEvent('BLOCKED', 'Service Workers are not supported in this browser.');
    return;
  }

  try {
    if (swStatusElement) {
      swStatusElement.textContent = 'Registering...';
    }
    const registration = await navigator.serviceWorker.register('./service-worker.js', {
      updateViaCache: 'none'
    });
    serviceWorkerRegistration = registration;
    await registration.update();

    if (navigator.serviceWorker.controller) {
      if (swStatusElement) {
        swStatusElement.textContent = 'Active & controlling';
      }
      logEvent('SW', 'Service Worker active and controlling client window.');
      navigator.serviceWorker.controller.postMessage({type: 'probe'});
    } else {
      if (swStatusElement) {
        swStatusElement.textContent = 'Claiming client...';
      }
      logEvent('SW', 'Service Worker registered; claiming client via skipWaiting / clients.claim().');
    }

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (swStatusElement) {
        swStatusElement.textContent = 'Active & controlling';
      }
      logEvent('SW', 'navigator.serviceWorker controllerchange event fired. Client is now controlled.');
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({type: 'probe'});
      }
    });

    await navigator.serviceWorker.ready;
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({type: 'probe'});
    }
  } catch (err) {
    if (swStatusElement) {
      swStatusElement.textContent = `Registration Failed (${err.message})`;
    }
    logEvent('BLOCKED', `Failed to register service-worker.js: ${err.message}`);
  }
}

function buildPopupUrl(scenario, payload) {
  const params = new URLSearchParams();
  params.set('scenario', scenario);
  params.set('caseTitle', payload.caseTitle || scenario);
  params.set('optionsText', payload.optionsText || '');
  params.set('timestamp', String(Date.now()));
  return `popup.html?${params.toString()}`;
}

function handleServiceWorkerMessage(event) {
  const data = event.data;
  if (!data || typeof data !== 'object') {
    return;
  }

  if (data.type === 'sw-status') {
    const swStatusElement = document.getElementById('swStatusText');
    if (swStatusElement) {
      swStatusElement.textContent = data.status;
    }
    logEvent('SW', `Service worker status: ${data.status}`);
    return;
  }

  if (data.type === 'probe-status') {
    const featureElement = document.getElementById('featureSupportText');
    const previousStatus = featureElement ? featureElement.textContent : '';
    if (featureElement) {
      featureElement.textContent = data.status;
    }
    if (previousStatus !== data.status) {
      logEvent('INFO', `Popup delegation support: ${data.status}`);
    }
    return;
  }

  if (data.type === 'notification-shown') {
    logEvent('INFO', `Notification created: "${data.title}". Click the OS notification banner to trigger delegation.`);
    return;
  }

  if (data.type === 'log-result') {
    const scenario = data.scenario;
    const outcome = data.outcome;
    const errorName = data.errorName || '';
    const errorMessage = data.errorMessage || '';

    if (outcome === 'threw') {
      logEvent('PASS', `[Scenario: ${scenario}] Service Worker caught ${errorName}: ${errorMessage}`);
    } else {
      logEvent('BLOCKED', `[Scenario: ${scenario}] Service Worker result: ${outcome} ${errorMessage}`);
    }
    return;
  }

  if (data.type === 'open-popup') {
    const scenario = data.scenario;
    const payload = data.payload || {};

    window.lastDelegatedMessage = {
      caseTitle: payload.caseTitle || `[${scenario}]`,
      scenario: scenario,
      optionsText: payload.optionsText || '(none)',
      delegatedAt: new Date().toISOString()
    };

    switch (scenario) {
      case 'delegate-popup': {
        const popupUrl = buildPopupUrl(scenario, payload);
        const popupWindow = window.open(popupUrl, '_blank', 'width=540,height=620');
        if (popupWindow) {
          logEvent('PASS', 'Primary Demo: Popup successfully opened with delegated capability token! (window.open returned non-null Window reference)');
        } else {
          logEvent('BLOCKED', 'Primary Demo: Popup blocked. Ensure chrome://flags/#enable-experimental-web-platform-features is enabled and notification was clicked.');
        }
        break;
      }

      case 'control-no-delegation': {
        const popupUrl = buildPopupUrl(scenario, payload);
        const popupWindow = window.open(popupUrl, '_blank', 'width=540,height=620');
        if (!popupWindow) {
          logEvent('PASS', 'Control Test: Popup correctly blocked! (postMessage without {delegate: "popup"} did not delegate activation)');
        } else {
          logEvent('INFO', 'Control Test: Popup was allowed. (Note: popups may be globally allowed for this origin in browser site settings)');
        }
        break;
      }

      case 'double-open': {
        const firstUrl = buildPopupUrl('double-open-1', payload);
        const secondUrl = buildPopupUrl('double-open-2', payload);
        const firstWindow = window.open(firstUrl, '_blank', 'width=540,height=620');
        const secondWindow = window.open(secondUrl, '_blank', 'width=540,height=620');

        const firstOpened = Boolean(firstWindow);
        const secondOpened = Boolean(secondWindow);

        if (firstOpened && !secondOpened) {
          logEvent('PASS', 'Single-Use Receiver Token: 1st window.open() opened successfully, 2nd window.open() was blocked as token was consumed!');
        } else if (firstOpened && secondOpened) {
          logEvent('INFO', 'Single-Use Receiver Token: Both windows opened. Note: Popups may be permitted without restriction in browser site settings.');
        } else {
          logEvent('BLOCKED', `Single-Use Receiver Token: 1st window opened: ${firstOpened}, 2nd window opened: ${secondOpened}`);
        }
        break;
      }

      case 'double-postmessage': {
        const popupUrl = buildPopupUrl(scenario, payload);
        const popupWindow = window.open(popupUrl, '_blank', 'width=540,height=620');
        if (popupWindow) {
          logEvent('PASS', 'Single-Use Sender Token: 1st postMessage successfully opened popup. Waiting for 2nd postMessage result from SW...');
        } else {
          logEvent('INFO', 'Single-Use Sender Token: 1st window.open returned null.');
        }
        break;
      }

      case 'expired-token': {
        logEvent('INFO', 'Token Expiration Test: Received delegated token. Waiting 1.5s before calling window.open()...');
        setTimeout(() => {
          const popupUrl = buildPopupUrl(scenario, payload);
          const popupWindow = window.open(popupUrl, '_blank', 'width=540,height=620');
          if (!popupWindow) {
            logEvent('PASS', 'Token Expiration Test: Popup correctly blocked after 1.5s delay! (Transient activation expired)');
          } else {
            logEvent('INFO', 'Token Expiration Test: Popup opened after 1.5s delay. (Check browser popup blocking settings)');
          }
        }, 1500);
        break;
      }

      default: {
        const popupUrl = buildPopupUrl(scenario, payload);
        const popupWindow = window.open(popupUrl, '_blank', 'width=540,height=620');
        logEvent('INFO', `Received scenario "${scenario}". window.open result: ${Boolean(popupWindow)}`);
        break;
      }
    }
  }
}

function getActiveOptionsText(didWait) {
  const optionsList = [];
  if (didWait) {
    optionsList.push('waited 5.2s');
  }
  const focusCheckbox = document.getElementById('checkFocusFirst');
  if (focusCheckbox && focusCheckbox.checked) {
    optionsList.push('called await client.focus()');
  }
  return optionsList.length > 0 ? optionsList.join(', ') : '(none)';
}

async function triggerNotificationScenario(scenario) {
  if (!navigator.serviceWorker.controller) {
    logEvent('BLOCKED', 'Service Worker controller not active. Please wait or reload.');
    return;
  }

  if (Notification.permission !== 'granted') {
    logEvent('BLOCKED', 'Notification permission not granted. Click "Request permission" first.');
    return;
  }

  const checkWait = document.getElementById('checkWaitActivation');
  const shouldWait = checkWait ? checkWait.checked : true;
  let didWait = false;
  if (shouldWait) {
    const delayMs = 5200;
    logEvent('INFO', `Waiting ${(delayMs / 1000).toFixed(1)}s for button-click transient user activation to expire before showing notification...`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    while (navigator.userActivation?.isActive) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    didWait = true;
  }

  const caseLabel = SCENARIO_LABELS[scenario] || scenario;
  const caseTitle = `[${scenario}] ${caseLabel}`;
  const optionsText = getActiveOptionsText(didWait);
  const focusCheckbox = document.getElementById('checkFocusFirst');
  const focusFirst = focusCheckbox ? focusCheckbox.checked : true;

  navigator.serviceWorker.controller.postMessage({
    type: 'show-notification',
    scenario: scenario,
    caseTitle: caseTitle,
    optionsText: optionsText,
    focusFirst: focusFirst
  });

  logEvent('INFO', `Scheduled ${caseTitle}. Options: ${optionsText}. Click incoming notification banner to trigger.`);
}

function initEventHandlers() {
  const btnRequest = document.getElementById('btnRequestPermission');
  if (btnRequest) {
    btnRequest.addEventListener('click', async () => {
      if (!('Notification' in window)) {
        logEvent('BLOCKED', 'Notification API is not supported in this browser.');
        return;
      }
      try {
        const result = await Notification.requestPermission();
        updateNotificationPermissionUI();
        logEvent('INFO', `Notification permission requested: ${result}`);
      } catch (err) {
        logEvent('BLOCKED', `Notification.requestPermission error: ${err.message}`);
      }
    });
  }

  const btnClear = document.getElementById('btnClearLog');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      const container = document.getElementById('logContainer');
      if (container) {
        container.textContent = '';
      }
    });
  }

  const btnPrimary = document.getElementById('btnPrimaryDemo');
  if (btnPrimary) {
    btnPrimary.addEventListener('click', () => {
      triggerNotificationScenario('delegate-popup');
    });
  }

  const btnControl = document.getElementById('btnControlNoDelegation');
  if (btnControl) {
    btnControl.addEventListener('click', () => {
      triggerNotificationScenario('control-no-delegation');
    });
  }

  const btnDoubleOpen = document.getElementById('btnDoubleOpen');
  if (btnDoubleOpen) {
    btnDoubleOpen.addEventListener('click', () => {
      triggerNotificationScenario('double-open');
    });
  }

  const btnDoublePost = document.getElementById('btnDoublePostMessage');
  if (btnDoublePost) {
    btnDoublePost.addEventListener('click', () => {
      triggerNotificationScenario('double-postmessage');
    });
  }

  const btnExpiry = document.getElementById('btnExpiredToken');
  if (btnExpiry) {
    btnExpiry.addEventListener('click', () => {
      triggerNotificationScenario('expired-token');
    });
  }

  const btnNoActivation = document.getElementById('btnNoActivation');
  if (btnNoActivation) {
    btnNoActivation.addEventListener('click', () => {
      if (!navigator.serviceWorker.controller) {
        logEvent('BLOCKED', 'Service Worker controller not active.');
        return;
      }
      logEvent('INFO', 'Testing SW postMessage({delegate: "popup"}) without notification click...');
      navigator.serviceWorker.controller.postMessage({
        type: 'trigger-without-activation'
      });
    });
  }

  const btnUnsupported = document.getElementById('btnUnsupportedCapability');
  if (btnUnsupported) {
    btnUnsupported.addEventListener('click', () => {
      triggerNotificationScenario('unsupported-capability');
    });
  }

  const btnFrame = document.getElementById('btnFrameDelegation');
  if (btnFrame) {
    btnFrame.addEventListener('click', () => {
      logEvent('INFO', 'Testing window.postMessage with {delegate: "popup"} from frame...');
      try {
        window.postMessage({type: 'test-frame-delegate'}, {
          targetOrigin: '*',
          delegate: 'popup'
        });
        logEvent('BLOCKED', 'window.postMessage with {delegate: "popup"} unexpectedly succeeded without throwing.');
      } catch (err) {
        if (err.name === 'NotSupportedError') {
          logEvent('PASS', `window.postMessage({delegate: 'popup'}) correctly threw ${err.name}: ${err.message}`);
        } else {
          logEvent('INFO', `window.postMessage threw ${err.name}: ${err.message}`);
        }
      }
    });
  }

  navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.search.includes('fallback=openWindow')) {
    logEvent('INFO', 'Main window opened via clients.openWindow() fallback because no existing WindowClient was open.');
  }
  updateNotificationPermissionUI();
  initEventHandlers();
  registerServiceWorker();
});
