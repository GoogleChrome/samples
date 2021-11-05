let keySession;

async function onCreateSessionButtonClick() {
  const config = [
    {
      initDataTypes: ["webm"],
      audioCapabilities: [{ contentType: 'audio/webm; codecs="opus"' }],
    },
  ];
  const keySystemAccess = await navigator.requestMediaKeySystemAccess(
    "org.w3.clearkey",
    config
  );
  // Create media keys.
  const mediaKeys = await keySystemAccess.createMediaKeys();
  // Create a key session.
  keySession = mediaKeys.createSession();
  // Generate a fake license request.
  await keySession.generateRequest("webm", new Uint8Array([1, 2, 3]));

  log(`Media key session is created.`);

  keySession.closed.then((reason) => {
    // Reason is either undefined if not supported, "internal-error",
    // "closed-by-application", "release-acknowledged",
    // "hardware-context-reset", or "resource-evicted".
    log(`Media key session was closed. Reason: "${reason}".`);
  });
}

async function onCloseSessionButtonClick() {
  // Will close media key session with "closed-by-application" reason.
  await keySession.close();
}
