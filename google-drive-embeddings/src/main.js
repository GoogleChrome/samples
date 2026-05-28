import { loadGoogleSDKs, initGoogleAPIClient, requestAuthToken, logout, showPicker, scanFolderRecursively, getAccessToken } from './drive.js';
import { TrackParser } from './parser.js';
import { initEmbedder, calculateEmbeddings, searchTracks, isModelLoaded, embedText } from './embedder.js';
import { dbGet, dbSet, dbDelete, dbClear } from './db.js';
import { GOOGLE_CONFIG } from './config.js';

// Application global state
const state = {
  apiKey: '',
  clientId: '',
  authorized: false,
  selectedFolder: null,
  rawTracks: [],       // Array of direct Drive API file metadata
  parsedTracks: [],    // Array of parsed, filtered, and editable track structures
  trackEmbeddings: [], // Vector float arrays for each approved track
  activeScan: null,    // References the active scan process object to support cancellation
  modelInitialized: false,
  playlistQueue: [],   // Array of tracks in current queue: [{ id, artist, title }]
  currentQueueIndex: -1 // Current active track index in playlistQueue
};

// Holds local memory URL resource for the current streaming audio track
let activeObjectUrl = null;

// Dynamic authentication promise resolvers to link GAPI callback to active user gestures
let pendingAuthResolver = null;
let pendingAuthRejecter = null;

// DOM Cache Reference Variables
const DOM = {
  // Credentials panel elements
  inputClientId: document.getElementById('input-client-id'),
  inputApiKey: document.getElementById('input-api-key'),
  inputProjectNumber: document.getElementById('input-project-number'),
  checkSaveCredentials: document.getElementById('check-save-credentials'),
  btnAuthorize: document.getElementById('btn-authorize'),
  btnLogout: document.getElementById('btnLogout') || document.getElementById('btn-logout'),
  authStatus: document.getElementById('auth-status'),
  credentialsSection: document.getElementById('credentials-section'),
  credentialsInputsWrapper: document.getElementById('credentials-inputs-wrapper'),
  credentialsProductionBadge: document.getElementById('credentials-production-badge'),
  
  // Scanner panel elements
  scannerSection: document.getElementById('scanner-section'),
  btnPickFolder: document.getElementById('btn-pick-folder'),
  selectedFolderInfo: document.getElementById('selected-folder-info'),
  scanControls: document.getElementById('scan-controls'),
  btnStartScan: document.getElementById('btn-start-scan'),
  btnCancelScan: document.getElementById('btn-cancel-scan'),
  scanProgressMsg: document.getElementById('scan-progress-msg'),
  scanMetrics: document.getElementById('scan-metrics'),
  metricFolders: document.getElementById('metric-folders'),
  metricFiles: document.getElementById('metric-files'),
  metricCandidates: document.getElementById('metric-candidates'),
  liveScanLog: document.getElementById('live-scan-log'),

  // Tracks listing elements
  tracksDisplaySection: document.getElementById('tracks-display-section'),
  tabApproved: document.getElementById('tab-approved'),
  tabRejected: document.getElementById('tab-rejected'),
  countApproved: document.getElementById('count-approved'),
  countRejected: document.getElementById('count-rejected'),
  checkLooseDelimiter: document.getElementById('check-loose-delimiter'),
  btnReparseTracks: document.getElementById('btn-reparse-tracks'),
  tableApprovedContainer: document.getElementById('table-approved-container'),
  tableRejectedContainer: document.getElementById('table-rejected-container'),
  tbodyApproved: document.getElementById('tbody-approved'),
  tbodyRejected: document.getElementById('tbody-rejected'),

  // Search & Indexing elements
  searchSection: document.getElementById('search-section'),
  btnInitializeModel: document.getElementById('btn-initialize-model'),
  indexStatusContainer: document.getElementById('index-status-container'),
  modelProgressMessage: document.getElementById('model-progress-message'),
  progressBarFill: document.getElementById('progress-bar-fill'),
  searchDashboard: document.getElementById('search-dashboard'),
  inputSearchQuery: document.getElementById('input-search-query'),
  btnSearch: document.getElementById('btn-search'),
  btnSearchReset: document.getElementById('btn-search-reset'),
  tbodySearchResults: document.getElementById('tbody-search-results'),

  // Audio Player elements
  audioPlayerPanel: document.getElementById('audio-player-panel'),
  playerTrackInfo: document.getElementById('player-track-info'),
  globalAudioElement: document.getElementById('global-audio-element'),
  btnClosePlayer: document.getElementById('btn-close-player'),

  // Search Caching & Rebuilding elements
  searchIndexStatus: document.getElementById('search-index-status'),
  btnRebuildIndex: document.getElementById('btn-rebuild-index'),

  // Search Playlist Elements
  searchPlaylistActions: document.getElementById('search-playlist-actions'),
  btnPlayAll: document.getElementById('btn-play-all'),
  btnShuffleAll: document.getElementById('btn-shuffle-all'),
  playlistQueueStatus: document.getElementById('playlist-queue-status'),
  playerQueueControls: document.getElementById('player-queue-controls'),
  btnPlayerSkip: document.getElementById('btn-player-skip')
};

/**
 * Main initialization on window load
 */
window.addEventListener('DOMContentLoaded', () => {
  initializeEnvironmentConfiguration();
  setupEventListeners();
  restoreCachedSession();

  // Pre-load GAPI and GIS SDK scripts in the background to warm user gestures and prevent popup blocks!
  loadGoogleSDKs().catch((err) => console.warn('Background SDK pre-loading delayed:', err));
});

/**
 * Reads credentials from localStorage if present to save developer typing
 */
function loadSavedCredentials() {
  const savedClientId = localStorage.getItem('gdrive_client_id');
  const savedApiKey = localStorage.getItem('gdrive_api_key');
  const savedProjectNumber = localStorage.getItem('gdrive_project_number');
  
  if (savedClientId) DOM.inputClientId.value = savedClientId;
  if (savedApiKey) DOM.inputApiKey.value = savedApiKey;
  if (savedProjectNumber) DOM.inputProjectNumber.value = savedProjectNumber;
}

/**
 * Installs UI component listeners
 */
function setupEventListeners() {
  // Auth flow
  DOM.btnAuthorize.addEventListener('click', handleAuthorization);
  DOM.btnLogout.addEventListener('click', handleLogout);

  // Folder Picking
  DOM.btnPickFolder.addEventListener('click', handlePickFolder);

  // Scanning control triggers
  DOM.btnStartScan.addEventListener('click', handleStartScan);
  DOM.btnCancelScan.addEventListener('click', handleCancelScan);

  // Tabs / display toggle
  DOM.tabApproved.addEventListener('change', toggleTrackTabs);
  DOM.tabRejected.addEventListener('change', toggleTrackTabs);

  // Reparsing filter values
  DOM.btnReparseTracks.addEventListener('click', handleReparseTracks);

  // Model embedding initialization
  DOM.btnInitializeModel.addEventListener('click', handleBuildSemanticIndex);

  // Search execution actions
  DOM.btnSearch.addEventListener('click', handleSearch);
  DOM.inputSearchQuery.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  DOM.btnSearchReset.addEventListener('click', handleSearchReset);

  // Audio Player Close action
  DOM.btnClosePlayer.addEventListener('click', handleClosePlayer);

  // Rebuild Index trigger
  DOM.btnRebuildIndex.addEventListener('click', handleRebuildIndex);

  // Playlist triggers
  DOM.btnPlayAll.addEventListener('click', () => handlePlayPlaylist(false));
  DOM.btnShuffleAll.addEventListener('click', () => handlePlayPlaylist(true));
  DOM.btnPlayerSkip.addEventListener('click', playNextInQueue);
  DOM.globalAudioElement.addEventListener('ended', playNextInQueue);
}

/**
 * Triggers GIS auth initial load and access token scopes
 */
async function handleAuthorization() {
  const clientId = DOM.inputClientId.value.trim();
  const apiKey = DOM.inputApiKey.value.trim();
  const projectNumber = DOM.inputProjectNumber.value.trim();

  if (!clientId || !apiKey || !projectNumber) {
    alert('Please enter your Client ID, API Key, and GCP Project Number.');
    return;
  }

  state.clientId = clientId;
  state.apiKey = apiKey;
  state.projectNumber = projectNumber;

  // Save/clear localStorage values
  if (DOM.checkSaveCredentials.checked) {
    localStorage.setItem('gdrive_client_id', clientId);
    localStorage.setItem('gdrive_api_key', apiKey);
    localStorage.setItem('gdrive_project_number', projectNumber);
  } else {
    localStorage.removeItem('gdrive_client_id');
    localStorage.removeItem('gdrive_api_key');
    localStorage.removeItem('gdrive_project_number');
  }

  DOM.btnAuthorize.disabled = true;
  DOM.authStatus.innerText = 'Connecting...';
  DOM.authStatus.style.color = 'orange';

  try {
    // Load external Google Libraries
    await loadGoogleSDKs();
    // Initialize standard clients
    await initGoogleAPIClient({
      apiKey,
      clientId,
      projectNumber,
      onAuthStatusChange: (status) => {
        if (status.authorized) {
          state.authorized = true;
          DOM.authStatus.innerText = 'Connected';
          DOM.authStatus.style.color = 'green';
          DOM.btnAuthorize.disabled = true;
          DOM.btnLogout.disabled = false;
          DOM.scannerSection.removeAttribute('disabled');
        } else {
          state.authorized = false;
          DOM.authStatus.innerText = `Error: ${status.error || 'Auth failed'}`;
          DOM.authStatus.style.color = 'red';
          DOM.btnAuthorize.disabled = false;
          DOM.btnLogout.disabled = true;
          DOM.scannerSection.setAttribute('disabled', 'true');
        }
      }
    });

    // Request actual login window popup
    requestAuthToken();
  } catch (err) {
    console.error('Authentication Error details:', err);
    DOM.authStatus.innerText = 'Failed to connect SDK';
    DOM.authStatus.style.color = 'red';
    DOM.btnAuthorize.disabled = false;
  }
}

/**
 * Disconnects OAuth session and wipes active templates state
 */
function handleLogout() {
  logout();
  state.authorized = false;
  state.selectedFolder = null;
  state.rawTracks = [];
  state.parsedTracks = [];
  state.trackEmbeddings = [];
  state.activeScan = null;
  state.projectNumber = null;
  
  DOM.authStatus.innerText = 'Not Connected';
  DOM.authStatus.style.color = 'red';
  DOM.btnAuthorize.disabled = false;
  DOM.btnLogout.disabled = true;
  
  // Hide panels and reset elements
  DOM.scannerSection.setAttribute('disabled', 'true');
  DOM.selectedFolderInfo.innerText = 'No folder selected';
  DOM.scanControls.style.display = 'none';
  DOM.scanMetrics.style.display = 'none';
  DOM.tracksDisplaySection.style.display = 'none';
  DOM.searchSection.style.display = 'none';
  DOM.searchDashboard.style.display = 'none';
  DOM.indexStatusContainer.style.display = 'none';
  DOM.btnInitializeModel.style.display = 'inline-block';
  
  handleClosePlayer();
  
  // Clear stored session cache on logout
  clearSessionCache();
}

/**
 * Launches GAPI standard folder Picker dialog
 */
async function handlePickFolder() {
  if (!state.authorized) {
    console.log('Lazy auth triggered via Pick Folder click gesture.');
    try {
      await loginOnUserGesture();
    } catch (err) {
      console.warn('Lazy authorization aborted or failed:', err);
      return;
    }
  }

  try {
    showPicker(async (folder) => {
      state.selectedFolder = folder;
      
      // Save folder details to cache
      localStorage.setItem('gdrive_selected_folder', JSON.stringify(folder));
      
      // Clear remaining database caches since the parent folder has changed!
      await dbDelete('gdrive_raw_tracks');
      await dbDelete('gdrive_parsed_tracks');
      await dbDelete('gdrive_track_embeddings');
      
      state.rawTracks = [];
      state.parsedTracks = [];
      state.trackEmbeddings = [];
      
      DOM.selectedFolderInfo.innerText = `Folder: ${folder.name} (ID: ${folder.id})`;
      DOM.scanControls.style.display = 'block';
      DOM.btnStartScan.disabled = false;
      DOM.btnCancelScan.disabled = true;
      DOM.scanProgressMsg.innerText = 'Click "Start Scan" to check subfolders.';
      
      // Hide track and search containers since a fresh scan is required!
      DOM.tracksDisplaySection.style.display = 'none';
      DOM.searchSection.style.display = 'none';
      DOM.searchDashboard.style.display = 'none';
    });
  } catch (err) {
    alert(err.message);
  }
}

/**
 * Logs output items in standard scrolling log box
 */
function logScanItem(message) {
  const line = document.createElement('div');
  line.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
  DOM.liveScanLog.appendChild(line);
  DOM.liveScanLog.scrollTop = DOM.liveScanLog.scrollHeight;
}

/**
 * Starts the recursive search scans over folder parents
 */
async function handleStartScan() {
  if (!state.selectedFolder) return;

  // Clear elements and reset counts
  DOM.tbodyApproved.innerHTML = `<tr><td colspan="4" align="center"><em>Scanning in progress...</em></td></tr>`;
  DOM.tbodyRejected.innerHTML = `<tr><td colspan="3" align="center"><em>Scanning in progress...</em></td></tr>`;
  DOM.liveScanLog.innerHTML = '';
  
  state.rawTracks = [];
  state.parsedTracks = [];
  state.trackEmbeddings = [];
  
  DOM.metricFolders.innerText = '0';
  DOM.metricFiles.innerText = '0';
  DOM.metricCandidates.innerText = '0';

  DOM.btnPickFolder.disabled = true;
  DOM.btnStartScan.disabled = true;
  DOM.btnCancelScan.disabled = false;
  
  DOM.scanMetrics.style.display = 'block';
  DOM.tracksDisplaySection.style.display = 'none';
  DOM.searchSection.style.display = 'none';

  logScanItem(`Starting recursive scan inside "${state.selectedFolder.name}"...`);

  try {
    const scanProcess = await scanFolderRecursively(
      state.selectedFolder.id,
      // Progress reporting updates
      async (progress) => {
        DOM.metricFolders.innerText = progress.foldersScanned;
        DOM.metricFiles.innerText = progress.filesScanned;
        DOM.metricCandidates.innerText = progress.tracksFound;

        if (progress.status === 'scanning') {
          DOM.scanProgressMsg.innerText = `Scanning directories... (Checking folder ID: ${progress.currentFolderId.substring(0, 8)}...)`;
        } else if (progress.status === 'completed') {
          DOM.scanProgressMsg.innerText = 'Scan finished successfully!';
          DOM.btnPickFolder.disabled = false;
          DOM.btnStartScan.disabled = false;
          DOM.btnCancelScan.disabled = true;
          logScanItem(`Scan completed! Discovered ${state.rawTracks.length} total raw MP3 files.`);
          
          await processAndRenderTracks();
        } else if (progress.status === 'cancelled') {
          DOM.scanProgressMsg.innerText = 'Scan was cancelled by user.';
          DOM.btnPickFolder.disabled = false;
          DOM.btnStartScan.disabled = false;
          DOM.btnCancelScan.disabled = true;
          logScanItem('Scan stopped. Processing remaining partial files...');
          
          await processAndRenderTracks();
        }
      },
      // When a valid files entry returns
      (file) => {
        // Prevent exact file ID duplicates (e.g. multi-parent folder references)
        if (state.rawTracks.some(t => t.id === file.id)) {
          console.log(`Deduplication: Skipped duplicate file ID: ${file.id} (${file.name})`);
          return;
        }
        state.rawTracks.push(file);
        logScanItem(`Discovered: "${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
      }
    );

    state.activeScan = scanProcess;
  } catch (err) {
    console.error('Scan error details:', err);
    DOM.scanProgressMsg.innerText = `Scan failed: ${err.message}`;
    DOM.btnPickFolder.disabled = false;
    DOM.btnStartScan.disabled = false;
    DOM.btnCancelScan.disabled = true;
  }
}

/**
 * Triggers manual search scan cancellations
 */
function handleCancelScan() {
  if (state.activeScan && typeof state.activeScan.cancel === 'function') {
    state.activeScan.cancel();
  }
}

/**
 * Reparses and filters files from current array when parser options are adjusted
 */
async function handleReparseTracks() {
  await processAndRenderTracks();
  // If model was already set up, warm user that index needs to be rebuilt for custom items
  if (state.trackEmbeddings.length > 0) {
    state.trackEmbeddings = [];
    await dbDelete('gdrive_track_embeddings');
    DOM.searchDashboard.style.display = 'none';
    DOM.btnInitializeModel.style.display = 'inline-block';
    DOM.indexStatusContainer.style.display = 'none';
    alert('Tracks list reparsed! You will need to rebuild the semantic search index to map these changes.');
  }
}

/**
 * Main routine: parses standard track filenames, divides lists, and binds to tables
 */
async function processAndRenderTracks() {
  const looseDelimiter = DOM.checkLooseDelimiter.checked;
  
  // 1. Parse all raw tracks using our parser configurations
  const parsedAll = state.rawTracks.map((track) => {
    const parsed = TrackParser.parse(track.name, { strictDelimiter: !looseDelimiter });
    return {
      id: track.id,
      originalName: track.name,
      size: track.size,
      webContentLink: track.webContentLink,
      approved: parsed.approved,
      artist: parsed.artist,
      title: parsed.title,
      reasons: parsed.reasons,
      checklist: parsed.checklist
    };
  });

  // 2. Perform metadata-based songs deduplication
  const seenKeys = new Set();
  const uniqueTracks = [];
  let duplicateCount = 0;

  parsedAll.forEach((track) => {
    let key = '';
    if (track.approved) {
      // Normalize values: lowercase, strip all symbols and spacing to combine words safely
      const normArtist = track.artist.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normTitle = track.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      key = `approved:${normArtist}:${normTitle}`;
    } else {
      const normName = track.originalName.toLowerCase().replace(/[^a-z0-9]/g, '');
      key = `rejected:${normName}`;
    }

    if (seenKeys.has(key)) {
      duplicateCount++;
    } else {
      seenKeys.add(key);
      uniqueTracks.push(track);
    }
  });

  // Re-index clean unique track objects
  state.parsedTracks = uniqueTracks.map((t, idx) => ({
    ...t,
    index: idx
  }));

  if (duplicateCount > 0) {
    logScanItem(`Deduplication: Filtered out ${duplicateCount} duplicate songs based on names/metadata.`);
    console.log(`Deduplication: Removed ${duplicateCount} duplicates. Unique count: ${state.parsedTracks.length}`);
  }

  // Cache raw and parsed lists in IndexedDB!
  try {
    await dbSet('gdrive_raw_tracks', state.rawTracks);
    await dbSet('gdrive_parsed_tracks', state.parsedTracks);
  } catch (err) {
    console.error('Failed to cache tracks in database:', err);
    alert('Database caching error: ' + err.message);
  }

  renderTracksList();
}

/**
 * Redraws approved/rejected tracks structures based on selected values
 */
function renderTracksList() {
  const approved = state.parsedTracks.filter(t => t.approved);
  const rejected = state.parsedTracks.filter(t => !t.approved);

  DOM.countApproved.innerText = approved.length;
  DOM.countRejected.innerText = rejected.length;

  DOM.tracksDisplaySection.style.display = 'block';

  // Render Approved
  if (approved.length === 0) {
    DOM.tbodyApproved.innerHTML = `<tr><td colspan="4" align="center"><em>No approved files. (Adjust delimiters or verify files naming patterns).</em></td></tr>`;
  } else {
    DOM.tbodyApproved.innerHTML = '';
    approved.forEach((track) => {
      const tr = document.createElement('tr');
      tr.id = `track-row-${track.index}`;
      
      tr.innerHTML = `
        <td><a href="${track.webContentLink}" target="_blank" style="font-size: 0.9em;">${escapeHtml(track.originalName)}</a></td>
        <td class="col-artist">${escapeHtml(track.artist)}</td>
        <td class="col-title">${escapeHtml(track.title)}</td>
        <td>
          <button class="btn-play-track" data-index="${track.index}">Play</button>
          <button class="btn-edit-track" data-index="${track.index}">Edit</button>
        </td>
      `;
      
      // Bind immediate row button handlers
      tr.querySelector('.btn-play-track').addEventListener('click', () => {
        playTrack(track.id, track.artist, track.title);
      });
      tr.querySelector('.btn-edit-track').addEventListener('click', () => {
        enterEditMode(track.index);
      });

      DOM.tbodyApproved.appendChild(tr);
    });
  }

  // Render Rejected
  if (rejected.length === 0) {
    DOM.tbodyRejected.innerHTML = `<tr><td colspan="3" align="center"><em>No files filtered out! All MP3s approved.</em></td></tr>`;
  } else {
    DOM.tbodyRejected.innerHTML = '';
    rejected.forEach((track) => {
      const tr = document.createElement('tr');
      const checklistText = `
        Sep: ${track.checklist.separatorFound ? '✅' : '❌'} | 
        Art: ${track.checklist.artistValid ? '✅' : '❌'} | 
        Tit: ${track.checklist.titleValid ? '✅' : '❌'}
      `;
      
      tr.innerHTML = `
        <td><span style="font-size: 0.9em; opacity: 0.8;">${escapeHtml(track.originalName)}</span></td>
        <td style="color: red; font-size: 0.9em;">${escapeHtml(track.reasons.join('; '))}</td>
        <td style="font-family: monospace; font-size: 0.85em;">${checklistText}</td>
      `;
      DOM.tbodyRejected.appendChild(tr);
    });
  }

  // Show Semantic vector field indexer only if we have at least one approved track!
  if (approved.length > 0) {
    DOM.searchSection.style.display = 'block';
  } else {
    DOM.searchSection.style.display = 'none';
  }
}

/**
 * Puts an approved row in edit/input text state for corrections
 */
function enterEditMode(trackIndex) {
  const track = state.parsedTracks.find(t => t.index === trackIndex);
  if (!track) return;

  const row = document.getElementById(`track-row-${trackIndex}`);
  if (!row) return;

  const artistCol = row.querySelector('.col-artist');
  const titleCol = row.querySelector('.col-title');
  const actionCol = row.cells[3];

  // Save current cell markup just in case we need a cancel, though standard is straight swap
  const oldArtist = track.artist;
  const oldTitle = track.title;

  artistCol.innerHTML = `<input type="text" class="input-edit-artist" value="${escapeHtml(oldArtist)}" style="width: 90%;" />`;
  titleCol.innerHTML = `<input type="text" class="input-edit-title" value="${escapeHtml(oldTitle)}" style="width: 90%;" />`;
  
  actionCol.innerHTML = `
    <button class="btn-save-edit" data-index="${trackIndex}">Save</button>
    <button class="btn-cancel-edit" data-index="${trackIndex}">Cancel</button>
  `;

  actionCol.querySelector('.btn-save-edit').addEventListener('click', () => {
    const newArtist = artistCol.querySelector('.input-edit-artist').value.trim();
    const newTitle = titleCol.querySelector('.input-edit-title').value.trim();
    
    if (!newArtist || !newTitle) {
      alert('Artist and Title cannot be empty!');
      return;
    }

    saveTrackEdit(trackIndex, newArtist, newTitle);
  });

  actionCol.querySelector('.btn-cancel-edit').addEventListener('click', () => {
    // Restore raw visual cells
    renderTracksList();
  });
}

/**
 * Saves edited metadata values back to our state, with dynamic vector update if model ready!
 */
async function saveTrackEdit(trackIndex, newArtist, newTitle) {
  const track = state.parsedTracks.find(t => t.index === trackIndex);
  if (!track) return;

  track.artist = newArtist;
  track.title = newTitle;

  // Save the modified list in IndexedDB!
  await dbSet('gdrive_parsed_tracks', state.parsedTracks);

  // Render normal rows first
  renderTracksList();

  // HIGH-TECH UPDATE: If vector embeddings list is already calculated, dynamically calculate vectors for JUST this entry!
  const approved = state.parsedTracks.filter(t => t.approved);
  const approvedIndex = approved.findIndex(t => t.index === trackIndex);

  if (state.trackEmbeddings.length > 0 && approvedIndex !== -1) {
    console.log(`Re-generating single vector for changed track indices: ${trackIndex}`);
    try {
      const textToEmbed = `Artist: ${newArtist} | Title: ${newTitle}`;
      // Ensure dynamic model is loaded in memory
      if (!isModelLoaded()) {
        console.log('Model not in memory. Initializing for dynamic update...');
        await handleBuildSemanticIndex();
      }
      const chunkResult = await embedText(textToEmbed, { taskType: 'document' });
      state.trackEmbeddings[approvedIndex] = chunkResult.embeddings[0].values;
      console.log('Single track vector successfully updated!');
      
      // Save updated embeddings!
      await saveEmbeddingsToCache();
    } catch (err) {
      console.error('Failed to update single vector embedding:', err);
      state.trackEmbeddings[approvedIndex] = null;
    }
  }
}

/**
 * Toggle track table view displays based on tab selections
 */
function toggleTrackTabs() {
  if (DOM.tabApproved.checked) {
    DOM.tableApprovedContainer.style.display = 'block';
    DOM.tableRejectedContainer.style.display = 'none';
  } else {
    DOM.tableApprovedContainer.style.display = 'none';
    DOM.tableRejectedContainer.style.display = 'block';
  }
}

/**
 * Initializes the Gemma-300M model and indexes all current approved tracks
 */
async function handleBuildSemanticIndex() {
  const approvedTracks = state.parsedTracks.filter(t => t.approved);
  if (approvedTracks.length === 0) return;

  DOM.btnInitializeModel.style.display = 'none';
  DOM.indexStatusContainer.style.display = 'block';
  DOM.progressBarFill.style.width = '0%';

  try {
    // 1. Initialize the Embedder polyfill (loads/downloads the model weights)
    await initEmbedder((status) => {
      DOM.modelProgressMessage.innerText = status.message;
      if (status.status === 'loading-polyfill') {
        DOM.progressBarFill.style.width = '5%';
      } else if (status.status === 'initializing') {
        DOM.progressBarFill.style.width = '10%';
      } else if (status.status === 'downloading') {
        // Use full 0%-100% scale for model downloads progress!
        DOM.progressBarFill.style.width = `${status.percent}%`;
      } else if (status.status === 'ready') {
        DOM.progressBarFill.style.width = '100%';
      }
    });

    // Reset progress bar to 0% before starting vector generation steps
    DOM.progressBarFill.style.width = '0%';
    DOM.modelProgressMessage.innerText = 'Starting vector calculations...';

    // 2. Generate vector document representations for approved items
    state.trackEmbeddings = await calculateEmbeddings(approvedTracks, (progress) => {
      DOM.modelProgressMessage.innerText = progress.message;
      // Use full 0%-100% scale for indexing/vector generation progress!
      DOM.progressBarFill.style.width = `${progress.percent}%`;
    });

    state.modelInitialized = true;
    
    // Save vector index in cache!
    saveEmbeddingsToCache();

    // Reset status label styles
    DOM.searchIndexStatus.innerText = 'Vector Index: Active (All tracks indexed)';
    DOM.searchIndexStatus.style.color = 'green';

    // Index build finish! Hide status and launch Search Panel!
    setTimeout(() => {
      DOM.indexStatusContainer.style.display = 'none';
      DOM.searchDashboard.style.display = 'block';
      DOM.inputSearchQuery.focus();
    }, 1000);

  } catch (err) {
    console.error(err);
    DOM.modelProgressMessage.innerText = `Error building search index: ${err.message}`;
    DOM.progressBarFill.style.backgroundColor = 'red';
    DOM.btnInitializeModel.style.display = 'inline-block';
  }
}

/**
 * Executes a semantic search query comparing cosine similarity arrays
 */
async function handleSearch() {
  const query = DOM.inputSearchQuery.value.trim();
  if (!query) return;

  const approvedTracks = state.parsedTracks.filter(t => t.approved);
  if (approvedTracks.length === 0 || state.trackEmbeddings.length === 0) return;

  DOM.tbodySearchResults.innerHTML = `<tr><td colspan="4" align="center"><em>Calculating vector distances...</em></td></tr>`;

  try {
    // Dynamically initialize the embedder on-demand if loaded from cache session!
    if (!isModelLoaded()) {
      DOM.tbodySearchResults.innerHTML = `<tr><td colspan="4" align="center"><em>Loading on-device AI Model to embed search query...</em></td></tr>`;
      await initEmbedder((status) => {
        DOM.tbodySearchResults.innerHTML = `<tr><td colspan="4" align="center"><em>Loading AI Model: ${escapeHtml(status.message)}</em></td></tr>`;
      });
      state.modelInitialized = true;
      DOM.tbodySearchResults.innerHTML = `<tr><td colspan="4" align="center"><em>Calculating vector distances...</em></td></tr>`;
    }

    const results = await searchTracks(query, approvedTracks, state.trackEmbeddings);
    state.searchResults = results;

    DOM.tbodySearchResults.innerHTML = '';
    
    if (results.length === 0) {
      DOM.tbodySearchResults.innerHTML = `<tr><td colspan="4" align="center"><em>No tracks indexed.</em></td></tr>`;
      return;
    }

    // Show playlist actions bar and update status details!
    DOM.searchPlaylistActions.style.display = 'block';
    DOM.playlistQueueStatus.innerText = `${results.length} songs ready in search scope`;

    results.forEach((track) => {
      const tr = document.createElement('tr');
      const matchPercent = Math.round(track.score * 100);
      
      // Determine coloring indicator based on cosine scores
      let scoreColor = 'inherit';
      if (track.score > 0.75) scoreColor = 'green';
      else if (track.score > 0.50) scoreColor = 'orange';

      tr.innerHTML = `
        <td><strong style="color: ${scoreColor}; font-family: monospace;">${matchPercent}%</strong></td>
        <td>${escapeHtml(track.artist)}</td>
        <td>${escapeHtml(track.title)}</td>
        <td><button class="btn-play-search" data-id="${track.id}">Play</button></td>
      `;

      tr.querySelector('.btn-play-search').addEventListener('click', () => {
        playTrack(track.id, track.artist, track.title);
      });

      DOM.tbodySearchResults.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    DOM.tbodySearchResults.innerHTML = `<tr><td colspan="4" align="center" style="color: red;">Search failed: ${err.message}</td></tr>`;
  }
}

/**
 * Resets search view metrics
 */
function handleSearchReset() {
  DOM.inputSearchQuery.value = '';
  DOM.tbodySearchResults.innerHTML = `<tr><td colspan="4" align="center"><em>Enter a search query to search semantic embeddings!</em></td></tr>`;
  
  // Hide search playlist actions panel
  DOM.searchPlaylistActions.style.display = 'none';
}

/**
 * Plays selected track inside browser native audio tags by downloading it as a Blob
 * and feeding a dynamic local Object URL to the media player to avoid CORS / redirect bugs.
 */
async function playTrack(fileId, artist, title, options = {}) {
  const { fromQueue = false } = options;

  // If a standalone track is played directly, clear the active playlist queue!
  if (!fromQueue) {
    state.playlistQueue = [];
    state.currentQueueIndex = -1;
    DOM.playerQueueControls.style.display = 'none';
  }

  if (!state.authorized) {
    console.log('Lazy auth triggered via Play click gesture.');
    try {
      await loginOnUserGesture();
    } catch (err) {
      console.warn('Lazy authorization aborted or failed:', err);
      return;
    }
  }

  const token = getAccessToken();
  if (!token) {
    alert('Access token is missing. Please log in again.');
    return;
  }

  // Revoke previous object URL if any to prevent memory leaks!
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }

  DOM.playerTrackInfo.innerText = `Loading: ${getTrackDisplayTitle(artist, title)}...`;
  DOM.audioPlayerPanel.style.display = 'flex';
  
  // Stop current audio and reset source
  DOM.globalAudioElement.pause();
  DOM.globalAudioElement.src = '';

  // Download raw file bytes as a Blob with standard Bearer authorization headers
  fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.blob();
  })
  .then((blob) => {
    // Create a local virtual memory Object URL pointing to the file bytes
    activeObjectUrl = URL.createObjectURL(blob);
    
    DOM.playerTrackInfo.innerText = getTrackDisplayTitle(artist, title);
    
    // If in playlist mode, show active skip button controls
    if (state.playlistQueue.length > 0) {
      DOM.playerQueueControls.style.display = 'flex';
    } else {
      DOM.playerQueueControls.style.display = 'none';
    }

    DOM.globalAudioElement.src = activeObjectUrl;
    DOM.globalAudioElement.load();
    DOM.globalAudioElement.play().catch((err) => {
      console.error('Audio play stream error:', err);
      alert('Failed to play the audio stream. Make sure the file format is supported by your browser.');
    });
  })
  .catch((err) => {
    console.error('Failed to download media file from Google Drive:', err);
    DOM.playerTrackInfo.innerText = `Error loading track: ${getTrackDisplayTitle(artist, title)}`;
    alert(`Error downloading media from Google Drive: ${err.message}`);
  });
}

/**
 * Stops audio playback, resets source tags, and frees memory by revoking the Object URL
 */
function handleClosePlayer() {
  DOM.globalAudioElement.pause();
  DOM.globalAudioElement.src = '';
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }
  DOM.audioPlayerPanel.style.display = 'none';

  // Wipe active playlist states on player close
  state.playlistQueue = [];
  state.currentQueueIndex = -1;
  DOM.playerQueueControls.style.display = 'none';
}

/**
 * Helper to prevent simple HTML injection issues when displaying lists
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Prompts Google Drive OAuth sign-in pop-up in response to a direct user click interaction.
 * Restores pre-loaded libraries, inputs, and credentials, returning a promise that resolves
 * the moment connection is authorized.
 */
function loginOnUserGesture() {
  if (state.authorized) return Promise.resolve();
  
  const clientId = DOM.inputClientId.value.trim();
  const apiKey = DOM.inputApiKey.value.trim();
  const projectNumber = DOM.inputProjectNumber.value.trim();

  if (!clientId || !apiKey || !projectNumber) {
    DOM.credentialsSection.scrollIntoView({ behavior: 'smooth' });
    alert('To access your Google Drive music files, please enter your Client ID, API Key, and Project Number in the credentials form at the top first!');
    return Promise.reject(new Error('Credentials missing'));
  }

  state.clientId = clientId;
  state.apiKey = apiKey;
  state.projectNumber = projectNumber;

  // Save credentials if checked
  if (DOM.checkSaveCredentials.checked) {
    localStorage.setItem('gdrive_client_id', clientId);
    localStorage.setItem('gdrive_api_key', apiKey);
    localStorage.setItem('gdrive_project_number', projectNumber);
  }

  DOM.authStatus.innerText = 'Connecting...';
  DOM.authStatus.style.color = 'orange';

  return new Promise(async (resolve, reject) => {
    pendingAuthResolver = resolve;
    pendingAuthRejecter = reject;

    try {
      // Background promise script loading (resolves instantly if already finished in background!)
      await loadGoogleSDKs();
      
      await initGoogleAPIClient({
        apiKey,
        clientId,
        projectNumber,
        onAuthStatusChange: (status) => {
          if (status.authorized) {
            state.authorized = true;
            DOM.authStatus.innerText = 'Connected';
            DOM.authStatus.style.color = 'green';
            DOM.btnAuthorize.disabled = true;
            DOM.btnLogout.disabled = false;
            DOM.scannerSection.removeAttribute('disabled');
            
            if (pendingAuthResolver) {
              pendingAuthResolver();
              pendingAuthResolver = null;
              pendingAuthRejecter = null;
            }
          } else {
            state.authorized = false;
            DOM.authStatus.innerText = `Error: ${status.error || 'Auth failed'}`;
            DOM.authStatus.style.color = 'red';
            DOM.btnAuthorize.disabled = false;
            DOM.btnLogout.disabled = true;
            DOM.scannerSection.setAttribute('disabled', 'true');
            
            if (pendingAuthRejecter) {
              pendingAuthRejecter(new Error(status.error || 'Auth failed'));
              pendingAuthResolver = null;
              pendingAuthRejecter = null;
            }
          }
        }
      });

      // Request standard popup! Safely uses current user-gesture tick!
      requestAuthToken();
    } catch (err) {
      DOM.authStatus.innerText = 'Connection failed';
      DOM.authStatus.style.color = 'red';
      DOM.btnAuthorize.disabled = false;
      reject(err);
    }
  });
}

/**
 * Saves active Float32Array embeddings vectors array natively in IndexedDB database.
 * No JSON serialization / array copy overhead!
 */
async function saveEmbeddingsToCache() {
  if (state.trackEmbeddings.length > 0) {
    await dbSet('gdrive_track_embeddings', state.trackEmbeddings);
  } else {
    await dbDelete('gdrive_track_embeddings');
  }
}

/**
 * Loads Float32Array vector arrays directly from our IndexedDB cache store
 */
async function loadEmbeddingsFromCache() {
  const cached = await dbGet('gdrive_track_embeddings');
  if (cached) {
    state.trackEmbeddings = cached;
  } else {
    state.trackEmbeddings = [];
  }
}

/**
 * Restores session from database caches if saved folder settings exist, redrawing layout tables
 */
async function restoreCachedSession() {
  const folderData = localStorage.getItem('gdrive_selected_folder');
  if (!folderData) return;

  try {
    state.selectedFolder = JSON.parse(folderData);
    DOM.selectedFolderInfo.innerText = `Folder: ${state.selectedFolder.name} (ID: ${state.selectedFolder.id})`;
    DOM.scanControls.style.display = 'block';
    DOM.btnStartScan.disabled = false;
    DOM.btnCancelScan.disabled = true;
    DOM.scanProgressMsg.innerText = 'Restored previous folder session! Ready to search or re-scan.';

    const rawData = await dbGet('gdrive_raw_tracks');
    const parsedData = await dbGet('gdrive_parsed_tracks');

    if (rawData && parsedData) {
      state.rawTracks = rawData;
      state.parsedTracks = parsedData;
      
      // Draw tables immediately
      renderTracksList();

      // Look for vector search database caches inside IndexedDB
      const cachedEmbeddings = await dbGet('gdrive_track_embeddings');
      if (cachedEmbeddings) {
        state.trackEmbeddings = cachedEmbeddings;
        
        // Visual updates to restore Search Screen directly!
        DOM.searchSection.style.display = 'block';
        DOM.btnInitializeModel.style.display = 'none';
        DOM.indexStatusContainer.style.display = 'none';
        DOM.searchDashboard.style.display = 'block';
        
        DOM.searchIndexStatus.innerText = 'Vector Index: Restored from cache! Ready for search.';
        DOM.searchIndexStatus.style.color = 'green';
      }
    }
  } catch (err) {
    console.error('Failed to restore cached folder session:', err);
    await clearSessionCache();
  }
}

/**
 * Resets database and local storage structures and clears session caches
 */
async function clearSessionCache() {
  localStorage.removeItem('gdrive_selected_folder');
  await dbDelete('gdrive_raw_tracks');
  await dbDelete('gdrive_parsed_tracks');
  await dbDelete('gdrive_track_embeddings');
}

/**
 * Action to force-rebuild the embedding index
 */
async function handleRebuildIndex() {
  const confirmRebuild = confirm('Are you sure you want to rebuild the semantic search index? This will re-index all approved tracks.');
  if (!confirmRebuild) return;

  state.trackEmbeddings = [];
  await dbDelete('gdrive_track_embeddings');
  
  DOM.searchDashboard.style.display = 'none';
  DOM.btnInitializeModel.style.display = 'inline-block';
  DOM.indexStatusContainer.style.display = 'none';
  
  await handleBuildSemanticIndex();
}

/**
 * Checks if the application is running in a local developer loop (localhost)
 */
function isLocalhost() {
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host.endsWith('.local');
}

/**
 * Directs environment setup loading rules.
 * If running on a live hosted domain with production configs populated, collapses forms
 * to host a standard zero-config, single-click sign-in button.
 */
function initializeEnvironmentConfiguration() {
  const isLocal = isLocalhost();
  const hasProdConfig = !!(GOOGLE_CONFIG.clientId && GOOGLE_CONFIG.apiKey && GOOGLE_CONFIG.projectNumber);

  if (!isLocal && hasProdConfig) {
    console.log('Zero-Config production mode enabled.');

    // Pre-populate input tags dynamically behind the scenes so standard GAPI routines continue to read them
    DOM.inputClientId.value = GOOGLE_CONFIG.clientId;
    DOM.inputApiKey.value = GOOGLE_CONFIG.apiKey;
    DOM.inputProjectNumber.value = GOOGLE_CONFIG.projectNumber;

    // Collapse manual credentials details form and display the production badge
    DOM.credentialsInputsWrapper.style.display = 'none';
    DOM.credentialsProductionBadge.style.display = 'block';

    // Pre-populate current session GAPI state properties
    state.clientId = GOOGLE_CONFIG.clientId;
    state.apiKey = GOOGLE_CONFIG.apiKey;
    state.projectNumber = GOOGLE_CONFIG.projectNumber;
  } else {
    // Standard local dev mode: restore last locally saved form inputs
    loadSavedCredentials();
    
    if (hasProdConfig && isLocal) {
      console.log('Tip: Production configuration exists in config.js but is bypassed on localhost to allow custom testing.');
    }
  }
}

/**
 * Resolves a progress and loading display label for standard play flows
 */
function getTrackDisplayTitle(artist, title) {
  if (state.playlistQueue.length > 0) {
    return `(${state.currentQueueIndex + 1}/${state.playlistQueue.length}) ${artist} - ${title}`;
  }
  return `${artist} - ${title}`;
}

/**
 * Playlists Actions: maps current searchResults list into active queue and starts playing
 */
function handlePlayPlaylist(shuffleMode = false) {
  if (state.searchResults.length === 0) return;

  const queue = state.searchResults.map(t => ({ id: t.id, artist: t.artist, title: t.title }));

  if (shuffleMode) {
    // Knuth-Shuffle the play queue list randomly
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    console.log('Playlist queue shuffled randomly!');
  }

  state.playlistQueue = queue;
  state.currentQueueIndex = 0;

  // Trigger playback of first playlist item
  playTrack(queue[0].id, queue[0].artist, queue[0].title, { fromQueue: true });
}

/**
 * Playlists Actions: skips/plays the next item in active play queue.
 * Shuts down the player if no tracks remain.
 */
function playNextInQueue() {
  if (state.playlistQueue.length === 0) return;

  if (state.currentQueueIndex + 1 < state.playlistQueue.length) {
    state.currentQueueIndex++;
    const nextTrack = state.playlistQueue[state.currentQueueIndex];
    playTrack(nextTrack.id, nextTrack.artist, nextTrack.title, { fromQueue: true });
  } else {
    // End of playlist queue list! Clean close standard operations.
    handleClosePlayer();
    alert('Playlist queue finished! 🎵');
  }
}
