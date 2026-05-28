/**
 * Google Drive SDK wrapper for authentication, picker, and recursive folder listing.
 */

let tokenClient = null;
let accessToken = null;
let currentApiKey = null;
let currentClientId = null;
let currentProjectNumber = null;

/**
 * Loads a dynamic script from a URL.
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Stage 1: Load external Google Identity and API Client scripts
 */
export async function loadGoogleSDKs() {
  await Promise.all([
    loadScript('https://apis.google.com/js/api.js'),
    loadScript('https://accounts.google.com/gsi/client')
  ]);
}

/**
 * Stage 2: Initialize GAPI and GIS
 */
export function initGoogleAPIClient({ apiKey, clientId, projectNumber, onAuthStatusChange }) {
  currentApiKey = apiKey;
  currentClientId = clientId;
  currentProjectNumber = projectNumber;

  return new Promise((resolve, reject) => {
    // Initialize standard GAPI client
    gapi.load('client:picker', async () => {
      try {
        await gapi.client.init({
          apiKey: apiKey,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        });

        // Initialize Google Identity Services (GIS) token client
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file',
          callback: (response) => {
            if (response.error) {
              onAuthStatusChange({ authorized: false, error: response.error });
              reject(response);
              return;
            }
            accessToken = response.access_token;
            // Inject token in GAPI client so direct requests are authenticated
            gapi.client.setToken({ access_token: accessToken });
            onAuthStatusChange({ authorized: true, token: accessToken });
            resolve(accessToken);
          }
        });

        resolve();
      } catch (err) {
        console.error('GAPI initialization error:', err);
        reject(err);
      }
    });
  });
}

/**
 * Triggers the standard OAuth2 pop-up to request/renew tokens.
 */
export function requestAuthToken() {
  if (!tokenClient) {
    throw new Error('Google SDK is not initialized yet.');
  }
  tokenClient.requestAccessToken({ prompt: '' }); // Uses standard prompt (incremental consent / login)
}

/**
 * Revokes current auth token and cleans session
 */
export function logout() {
  if (accessToken) {
    google.accounts.oauth2.revokeToken(accessToken, () => {
      accessToken = null;
      gapi.client.setToken(null);
    });
  }
}

/**
 * Returns the current access token.
 */
export function getAccessToken() {
  return accessToken;
}

/**
 * Displays the standard Google Picker dialogue to choose folders only.
 */
export function showPicker(onFolderPicked) {
  if (!accessToken) {
    throw new Error('User is not authorized. Please log in first.');
  }

  // Create a view showing folders only, with folder selection enabled
  const view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
    .setMimeTypes('application/vnd.google-apps.folder')
    .setSelectFolderEnabled(true);

  const picker = new google.picker.PickerBuilder()
    .addView(view)
    .setOAuthToken(accessToken)
    .setDeveloperKey(currentApiKey)
    .setAppId(currentProjectNumber)
    .setCallback((data) => {
      if (data.action === google.picker.Action.PICKED) {
        const doc = data.docs[0];
        onFolderPicked({ id: doc.id, name: doc.name });
      }
    })
    .build();

  picker.setVisible(true);
}

/**
 * Recursively list all MP3 files inside a parent folder.
 * Uses Breadth-First Search (BFS) to prevent call-stack overflows.
 */
export async function scanFolderRecursively(rootFolderId, onProgress, onTrackFound) {
  const folderQueue = [rootFolderId];
  let filesScanned = 0;
  let foldersScanned = 0;
  let tracksFound = 0;
  let activeScan = true;

  // Let client trigger cancel
  const cancelScan = () => {
    activeScan = false;
  };

  const runScan = async () => {
    while (folderQueue.length > 0 && activeScan) {
      const currentFolderId = folderQueue.shift();
      foldersScanned++;

      onProgress({
        status: 'scanning',
        foldersScanned,
        filesScanned,
        tracksFound,
        currentFolderId
      });

      let pageToken = null;
      try {
        do {
          if (!activeScan) break;

          // Search for subfolders or mpeg audio files/names containing .mp3 inside the parent folder
          const query = `'${currentFolderId}' in parents and trashed = false and (mimeType = 'application/vnd.google-apps.folder' or mimeType = 'audio/mpeg' or name contains '.mp3')`;
          
          const response = await gapi.client.drive.files.list({
            q: query,
            fields: 'nextPageToken, files(id, name, mimeType, size, webContentLink)',
            pageSize: 100,
            pageToken: pageToken
          });

          const files = response.result.files || [];
          for (const file of files) {
            if (!activeScan) break;
            filesScanned++;

            if (file.mimeType === 'application/vnd.google-apps.folder') {
              folderQueue.push(file.id);
            } else {
              tracksFound++;
              onTrackFound(file);
            }
          }
          pageToken = response.result.nextPageToken;
        } while (pageToken && activeScan);

      } catch (err) {
        console.error(`Error scanning folder ${currentFolderId}:`, err);
        // Continue to other folders if one fails
      }
    }

    onProgress({
      status: activeScan ? 'completed' : 'cancelled',
      foldersScanned,
      filesScanned,
      tracksFound
    });
  };

  // Start scanning in the background
  const promise = runScan();

  return {
    promise,
    cancel: cancelScan
  };
}
