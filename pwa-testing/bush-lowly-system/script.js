'use strict';

if (location.protocol === 'https:')
  navigator.serviceWorker.register("service_worker.js");
else
  location.protocol = 'https:';
