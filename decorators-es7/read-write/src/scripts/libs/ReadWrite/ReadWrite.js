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

import DOMManager from './DOMManager';

var jobRAFScheduled = false;
var jobLists = {
  read: [],
  write: []
};

export function read (target, name, descriptor) {

  let readerOriginal = descriptor.value;
  let reader = readerOriginal.bind(target);

  descriptor.value = function () {
    // If the context has changed since the initial setup
    // update the reference to reader.
    if (this !== target) {
      reader = readerOriginal.bind(this);
      target = this;
    }

    jobLists.read.push(reader);
  };
  scheduleJobRAFIfNeeded();
}

export function write (target, name, descriptor) {

  let writerOriginal = descriptor.value;
  let writer = writerOriginal.bind(target);

  descriptor.value = function () {

    // If the context has changed since the initial setup
    // update the reference to writer.
    // console.log(this, target);
    if (this !== target) {
      writer = writerOriginal.bind(this);
      target = this;
    }

    jobLists.write.push(writer);
  };
  scheduleJobRAFIfNeeded();
}

function runJobs () {
  // Watch for the user trying to use setters
  // inside of a read task.
  DOMManager.disableWrites();
  jobLists.read.forEach(job => job.call());
  DOMManager.enableWrites();

  // And vice-versa.
  DOMManager.disableReads();
  jobLists.write.forEach(job => job.call());
  DOMManager.enableReads();

  jobLists.read.length = 0;
  jobLists.write.length = 0;
  jobRAFScheduled = false;
}

function scheduleJobRAFIfNeeded () {
  if (jobRAFScheduled)
    return;

  jobRAFScheduled = true;
  requestAnimationFrame(runJobs);
}
