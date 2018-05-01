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
    this._button = undefined;
    this._frameOfReference = undefined;

    if (!navigator.xr) {
      this._disabled = true;
      this._showWebXRNotSupportedError();
      return;
    }

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
        this._startRenderLoop(session);
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
    });
  }



  _createPresentationButton () {
    this._button = document.createElement('button');
    this._button.classList.add('vr-toggle');
    this._button.addEventListener('click', _ => {
      this._toggleVR();
    });
    document.body.appendChild(this._button);
  }

  _initThree () {
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    this._renderer = new THREE.WebGlRenderer();
    this._renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this._renderer.domElement );
    let geometry = new THREE.BoxGeometry(1,1,1);
    let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    this._cube = new THREE.Mesh(geometry, material);
    this._scene.add(cube);
    this._camera.position.z = 5;
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

  _startRenderLoop (session) {
    session.requestFrameOfReference('eyeLevel')
    .then(xrFrameOfRef => {
      this._frameOfReference = xrFrameOfRef;
    })
    // .then(this._setupWebGLLayer)
    .then(() => {
      let context = this._context;
      this._renderer = new THREE.WebGLRenderer({
        context: context
      })
      let glContext = this._renderer.context
      this._xrSession.baseLayer = new XRWebGLLayer(this._xrsession, glContext)
    })
    .then(() => {
      session.requestAnimationFrame(this._onFrame);
    });
  }

  _onFrame (t, frame) {
    // t is always 0 in early versions of the spec.
    let pose = frame.getDevicePose(this._frameOfReference)
    if (pose) {
      const ROTATION_VALUE = 4;
      const time = window.performance.now() * 0.0001;
      for (let view of frame.view) {
        this._cube.rotation.x = Math.sin(time) * ROTATION_VALUE;
        this._cube.rotation.y = Math.cos(time) * ROTATION_VALUE;
        this._renderer.render(this._scene, this._camera);
      }
    }
    frame.session.requestAnimationFrame(this._onFrame);
  }

  _toggleVR () {
    this._xrDevice.requestSession({
      outputContext: this._context,
      exclusive: true
    })
    .then(session => {
      this._startRenderLoop(session);
    })
  }
}

new DemoXR();
