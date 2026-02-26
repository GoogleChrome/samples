async function getInstalledApps() {
  const installedApps = await navigator.getInstalledRelatedApps();
  const giraStatus = document.getElementById('giraStatus');
  giraStatus.textContent = `resolved (${installedApps.length})`;
  const giraResults = document.getElementById('giraResults');
  giraResults.textContent = JSON.stringify(installedApps, null, 2);
}

if ('getInstalledRelatedApps' in navigator) {
  getInstalledApps();
} else {
  const giraStatus = document.getElementById('giraStatus');
  giraStatus.textContent = `not supported`;
}
