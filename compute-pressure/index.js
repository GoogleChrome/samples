(async () => {
  const elem = document.querySelector("#status-text");
  if (!("ComputePressureObserver" in window)) {
    elem.innerText = "not available";
    elem.classList.add("disabled")
    return;
  }
  elem.innerText = "enabled";
  elem.classList.add("enabled")

  const kNumRowsToKeep = 30;
  const tableBodyElem = document.querySelector("#table-body");
  let updates = [];
  const refreshTable = () => {
    const rows = [];
    // Resizes the array to kNumRowsToKeep.
    updates = updates.slice((updates.length - kNumRowsToKeep), updates.length)
    for (const [i, update] of updates.entries()) {
      const row = document.createElement("tr");
      const timeCell = document.createElement("td");
      const utilCell = document.createElement("td");
      const speedCell = document.createElement("td");
      row.appendChild(timeCell);
      row.appendChild(utilCell);
      row.appendChild(speedCell);
      rows.push(row);

      let timeValue = "-";
      if (i != 0) {
        timeValue = ((updates[i].timestamp - updates[i - 1].timestamp) / 1000).toFixed(2);
      }
      timeCell.innerText = timeValue;

      utilCell.innerText = update.data.cpuUtilization;
      speedCell.innerText = update.data.cpuSpeed;
    }

    // Clear out the table first.
    tableBodyElem.innerText = "";
    for (let row of rows.reverse()) {
      tableBodyElem.appendChild(row);
    }
  };

  const onupdate = (data) => {
    updates.push({data, timestamp: Date.now()});
    refreshTable();
  }
  const obs = new ComputePressureObserver(onupdate, {cpuUtilizationThresholds: [0.5, 0.25],
                                                     cpuSpeedThresholds: [0.5]});
  await obs.observe();
  window.obs = obs;
})();
