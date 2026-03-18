import firebase from '@firebase/app-compat';
export { default } from '@firebase/app-compat';
import '@firebase/analytics-compat';
import '@firebase/app-check-compat';
import '@firebase/auth-compat';
import '@firebase/database-compat';
import '@firebase/firestore-compat';
import '@firebase/functions-compat';
import '@firebase/messaging-compat';
import '@firebase/storage-compat';
import '@firebase/performance-compat';
import '@firebase/remote-config-compat';

var name$1 = "firebase";
var version$1 = "12.10.0";

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
firebase.registerVersion(name$1, version$1, 'app-compat');

var name = "firebase";
var version = "12.10.0";

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
console.warn(`
It looks like you're using the development build of the Firebase JS SDK.
When deploying Firebase apps to production, it is advisable to only import
the individual SDK components you intend to use.

For the module builds, these are available in the following manner
(replace <PACKAGE> with the name of a component - i.e. auth, database, etc):

CommonJS Modules:
const firebase = require('firebase/app');
require('firebase/<PACKAGE>');

ES Modules:
import firebase from 'firebase/app';
import 'firebase/<PACKAGE>';

TypeScript:
import firebase from 'firebase/app';
import 'firebase/<PACKAGE>';
`);
firebase.registerVersion(name, version, 'compat');
//# sourceMappingURL=index.esm.js.map
