/*!
 *
 * Copyright 2016 Google Inc. All rights reserved.
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

'use strict';

/* eslint-env es6 */

class DemoXR extends Demo {
  constructor () {
    super();

    this._onResize = this._onResize.bind(this);

    this._disabled = false;
    if (!navigator.xr) {
      this._disabled = true;
      this._showWebXRNotSupportedError();
      return;
    }

    this._button = undefined;
    navigator.xr.requestDevice()
    .then(device => {
      this._xrDevice = device;
      let outputCanvas = document.createElement('canvas');
      this._context = outputCanvas.getContext('xrpresent');
      // Default to magic window.
      this._xrDevice.requestSession({outputContext: this._context})
      .then(session => {
        this._xrSession = session;
        // Add the canvas to the doc once we know that will be rendered to.
        document.body.appendChild(outputCanvas);
        this._xrSession.addEventListener('end', this._sessionEnded);
        this._xrDevice.supportsSession({
          outputContext: this._context,
          exclusive: true
        })
        .then(() => {
          this._createPresentationButton();
        })
        .catch(err => {
          this._showNoPresentError()
        })
        // Start the loop.
      })
    })
    .catch(err => {
      this._showNoDeviceFoundError(err)
    })

    this._button = undefined;

  }



  _createPresentationButton () {
    this._button = document.createElement('button');
    this._button.classList.add('vr-toggle');
    this._button.addEventListener('click', _ => {
      this._toggleVR();
    })
  }

  _sessionEnded (event) {

  }

  _showNoDeviceFoundError (err) {
      if (err.name === 'NotFoundError') {
          console.error('No XR devices available:', err);
      } else if (err.name === 'NotAllowedError') {
          // Permissions have not been granted.
          // Trigger permission flow.
      } else {
          console.error('Something else went wrong.', err);
      }
  }

  _showNoPresentError () {
    console.error('This device only supports non-eclusive ()\'magic window\') mode.')
  }

  _showWebXRNotSupportedError () {
      console.error('WebXR not supported.');
  }

  _toggleVR () {
    //
  }
}
