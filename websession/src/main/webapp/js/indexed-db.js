
/**
 * Namespace for two-token based web session management JavaScript codes.
 */
var dosidos = dosidos || {};

/**
 * Namespace for storage layer.
 */
dosidos.store = dosidos.store || {};

/**
 * Indexed DB store name.
 */
dosidos.store.INDEXED_DB_STORE_ = 'two_token_web_session';

/**
 * Initializes the underline storage. Currently indexedDB is used.
 * The readXXX()/saveXXX() methods can be called only after this method invoked.
 */
dosidos.store.init_ = function() {
  return new Promise(function(resolve, reject) {
    if (dosidos.store.db_) {
      // Already initialized.
      resolve();
    } else {
      var request = indexedDB.open(dosidos.store.INDEXED_DB_STORE_);
      request.onsuccess = function(event) {
        dosidos.store.db_ = event.target.result;
        // Generic error handler
        dosidos.store.db_.onerror = function(event) {
          console.log("IndexedDB error: " + event.target.errorCode);
        };
        console.log("IndexedDB successfully initialized.");
        resolve();
      };
      request.onupgradeneeded = function(event) {
        var db = event.target.result;
        db.createObjectStore(dosidos.store.INDEXED_DB_STORE_);
      };
      request.onerror = function(event) {
        console.log("Failed to initilaize IndexedDB.");
        reject(event);
      };
    }
  });
};


/**
 * Reads value from indexed DB.
 */
dosidos.store.read_ = function(key) {
  return new Promise(function(resolve, reject) {
    var store = dosidos.store.db_
        .transaction(dosidos.store.INDEXED_DB_STORE_, 'readwrite')
        .objectStore(dosidos.store.INDEXED_DB_STORE_);
    var request = store.get(key);
    request.onsuccess = function(event) {
      resolve(request.result);
    };
    request.onerror = function(event) {
      console.log("Failed to read IndexedDB.");
      reject(event);
    };
  });
};

/**
 * Saves value into indexed DB. If value is null or undefined, the corresponding
 * key will be removed.
 */
dosidos.store.save_ = function(key, value) {
  return new Promise(function(resolve, reject) {
    var store = dosidos.store.db_
        .transaction(dosidos.store.INDEXED_DB_STORE_, 'readwrite')
        .objectStore(dosidos.store.INDEXED_DB_STORE_);
    if (value === undefined || value === null) {
      store['delete'](key);
    } else {
      store.put(value, key);
    }
    store.transaction.oncomplete = function() {
       resolve();
    }
  });
};

/*
 * Data structure for two-token web session status information.
 * @typedef {{
 *   active: (boolean|undefined),
 *   lat: (string|undefined),
 *   satExpires: (number|undefined)
 * }}
 */
dosidos.SessionState;

/**
 * The indexedDb key name for the session status.
 */
dosidos.store.KEY_SESSION_STATE_ = 'two_token_session_state';

/**
 * Reads next token refresh time.
 */
dosidos.store.readSessionState = function() {
  return dosidos.store.init_()
      .then(function() {
        return dosidos.store.read_(dosidos.store.KEY_SESSION_STATE_);
      })
      .then(function(value) {
        return (value && JSON.parse(value)) || {};
      });
};

dosidos.store.saveSessionState = function(json) {
  return dosidos.store.init_()
      .then(function() {
        var str = json && JSON.stringify(json);
        return dosidos.store.save_(dosidos.store.KEY_SESSION_STATE_, str);
      });
};

dosidos.store.changeSatExpires = function(satExpires) {
  satExpires = satExpires > 0 ? satExpires : 0;
  return dosidos.store.readSessionState()
     .then(function(sessionState) {
       if (sessionState && sessionState['enabled']) {
         sessionState['satExpires'] = satExpires;
         return dosidos.store.saveSessionState(sessionState);
       }
     });
};

dosidos.store.clear = function() {
  return dosidos.store.saveSessionState(undefined);
};

dosidos.store.suspend = function() {
  return dosidos.store.readSessionState().then(function(sessionState) {
    if (sessionState) {
      sessionState['enabled'] = false;
      return dosidos.store.saveSessionState(sessionStatee);
    }
  });
};

dosidos.store.restart = function(opt_sessionState) {
  return new Promise(function(resolve, reject) {
    if (opt_sessionState && opt_sessionState['lat']) {
      // Has new lat, just overwrite old sessionState.
      var sessionState = {
        'enabled': true,
        'lat': opt_sessionState['lat'],
        'satExpires':  opt_sessionState['satExpires']
      };
      return dosidos.store.saveSessionState(sessionState);
    }

    dosidos.store.readSessionState().then(function(sessionState) {
      if (sessionState && sessionState['lat']) {
        sessionState['enabled'] = true;
        if (opt_sessionState && opt_sessionState['satExpires']) {
          sessionState['satExpires'] = opt_sessionState['satExpires'];
        }
        return dosidos.store.saveSessionState(sessionState);
      }
    });
  });
};
