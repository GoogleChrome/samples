/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import LayoutTriggers from './LayoutTriggers';

class DOMManager {
  constructor () {
    this.candidates = LayoutTriggers;
    this.candidatesKeys = Object.keys(this.candidates);
    this.updateObserver = new MutationObserver(_ => null);
    this.updateObserverConfig = {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    };

    this.getters = new Map();
    this.methods = new Map();
  }

  disableReads () {

    this.candidatesKeys.forEach(candidatesKey => {

      let getters = this.candidates[candidatesKey].get;
      let methods = this.candidates[candidatesKey].method;

      if (!getters)
        return;

      getters.forEach(getter => {

        let descriptor = Object.getOwnPropertyDescriptor(
            window[candidatesKey].prototype, getter);

        if (!descriptor)
          return;

        let fn = descriptor.get;

        if (!fn)
          return;

        this.getters.set(`${candidatesKey}.${getter}`, fn);

        descriptor.get = function () {
          let warning = `DOM queried (${getter} getter) during write block`;
          let e = new Error(warning);
          console.warn (e.stack);
          return fn.apply(this);
        };

        Object.defineProperty(window[candidatesKey].prototype, getter,
            descriptor);
      });

      if (!methods)
        return;

      methods.forEach(method => {

        let fn = window[candidatesKey].prototype[method];

        if (!fn)
          return;

        window[candidatesKey].prototype[method] = function() {
          let warning = `DOM queried (${method}()) during write block`;
          let e = new Error(warning);
          console.warn (e.stack);
          return fn.apply(this);
        };

      });
    });
  }

  enableReads () {

    this.candidatesKeys.forEach(candidatesKey => {
      let getters = this.candidates[candidatesKey].get;

      if (!getters)
        return;

      getters.forEach(getter => {

        let originalGetterName = `${candidatesKey}.${getter}`;
        let descriptor = Object.getOwnPropertyDescriptor(
            window[candidatesKey].prototype, getter);

        if (!descriptor)
          return;

        let fn = descriptor.get;

        if (!fn)
          return;

        // Restore the getter.
        descriptor.get = this.getters.get(originalGetterName);
        this.getters.delete(originalGetterName);

        // Redefine the descriptor on the prototype.
        Object.defineProperty(window[candidatesKey].prototype, getter,
            descriptor);
      });
    });
  }

  disableWrites () {

    // TODO(@paullewis) Limit the scope of this.
    this.updateObserver.observe(document.body, this.updateObserverConfig);
  }

  enableWrites () {
    let mutations = this.updateObserver.takeRecords();
    if (mutations.length) {
      let e = new Error ('DOM mutated during read block');
      console.warn (e, mutations);
    }
    this.updateObserver.disconnect();
  }

}

export default new DOMManager();
