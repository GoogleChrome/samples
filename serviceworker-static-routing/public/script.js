const initServiceWorker = async () => {
  const registration = await navigator.serviceWorker.register("/serviceworker_static_routing/sw.js", {
    scope: "/serviceworker_static_routing/",
  });
};

const appendEntry = (key, value) => {
  const elm = document.createElement('div');
  elm.textContent = `${key}: ${value}`;
  document.querySelector('.content').appendChild(elm);
}

const getValueOrWarning = (value) => {
  if (value === undefined)
    return "Not defined. Please update to M131";
  if (value === "")
    return "No source (Not matched to any rule)";
  return value;
}

const logTimingInfo = () => {
  const elm = document.createElement('strong');
  elm.textContent = 'Relevant timestamp from navigation timing:';
  document.querySelector('.content').appendChild(elm);

  const [navTiming] = window.performance.getEntriesByType("navigation");
  appendEntry('workerStart', navTiming.workerStart)
  appendEntry('fetchStart', navTiming.fetchStart)
  appendEntry('responseStart', navTiming.responseStart)

  appendEntry('workerRouterEvaluationStart', getValueOrWarning(navTiming.workerRouterEvaluationStart))
  appendEntry('workerCacheLookupStart', getValueOrWarning(navTiming.workerCacheLookupStart))
  appendEntry('workerMatchedSourceType', getValueOrWarning(navTiming.workerMatchedSourceType))
  appendEntry('workerFinalSourceType', getValueOrWarning(navTiming.workerFinalSourceType))
  appendEntry('deliveryType', navTiming.deliveryType || "Empty deliveryType")
  appendEntry('encodedBodySize', navTiming.encodedBodySize);

  console.log(navTiming)

};

initServiceWorker();

window.addEventListener("load", (e) => {
  logTimingInfo();
});
