async function getInstalledApps() {
  const installedApps = await navigator.getInstalledRelatedApps();
  const giraStatus = document.getElementById('gira-status');
  giraStatus.textContent = `resolved (${installedApps.length})`;
  const giraResults = document.getElementById('gira-results');
  giraResults.textContent = JSON.stringify(installedApps, null, 2);
}

if ('getInstalledRelatedApps' in navigator) {
  getInstalledApps();
} else {
  const giraStatus = document.getElementById('gira-status');
  giraStatus.textContent = `not supported`;
}
