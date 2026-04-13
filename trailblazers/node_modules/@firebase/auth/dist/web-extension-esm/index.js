import { r as registerAuth, i as initializeAuth, a as indexedDBLocalPersistence, c as connectAuthEmulator } from './register-27e07cc8.js';
export { Y as ActionCodeURL, m as AuthCredential, A as AuthErrorCodes, E as EmailAuthCredential, q as EmailAuthProvider, F as FacebookAuthProvider, t as GithubAuthProvider, G as GoogleAuthProvider, O as OAuthCredential, w as OAuthProvider, P as PhoneAuthCredential, S as SAMLAuthProvider, T as TotpMultiFactorGenerator, b as TotpSecret, x as TwitterAuthProvider, J as applyActionCode, e as beforeAuthStateChanged, K as checkActionCode, I as confirmPasswordReset, c as connectAuthEmulator, M as createUserWithEmailAndPassword, l as debugErrorMap, k as deleteUser, V as fetchSignInMethodsForEmail, a4 as getAdditionalUserInfo, a1 as getIdToken, a2 as getIdTokenResult, a6 as getMultiFactorResolver, n as inMemoryPersistence, a as indexedDBLocalPersistence, i as initializeAuth, d as initializeRecaptchaConfig, R as isSignInWithEmailLink, B as linkWithCredential, a7 as multiFactor, f as onAuthStateChanged, o as onIdTokenChanged, Z as parseActionCodeURL, p as prodErrorMap, C as reauthenticateWithCredential, a5 as reload, j as revokeAccessToken, W as sendEmailVerification, H as sendPasswordResetEmail, Q as sendSignInLinkToEmail, s as setPersistence, y as signInAnonymously, z as signInWithCredential, D as signInWithCustomToken, N as signInWithEmailAndPassword, U as signInWithEmailLink, h as signOut, a3 as unlink, g as updateCurrentUser, $ as updateEmail, a0 as updatePassword, _ as updateProfile, u as useDeviceLanguage, v as validatePassword, X as verifyBeforeUpdateEmail, L as verifyPasswordResetCode } from './register-27e07cc8.js';
import { _getProvider, getApp } from '@firebase/app';
import { getDefaultEmulatorHost } from '@firebase/util';
import '@firebase/component';
import '@firebase/logger';

/**
 * @license
 * Copyright 2023 Google LLC
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
/**
 * Returns the Auth instance associated with the provided {@link @firebase/app#FirebaseApp}.
 * If no instance exists, initializes an Auth instance with platform-specific default dependencies.
 *
 * @param app - The Firebase App.
 *
 * @public
 */
function getAuth(app = getApp()) {
    const provider = _getProvider(app, 'auth');
    if (provider.isInitialized()) {
        return provider.getImmediate();
    }
    const auth = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence]
    });
    const authEmulatorHost = getDefaultEmulatorHost('auth');
    if (authEmulatorHost) {
        connectAuthEmulator(auth, `http://${authEmulatorHost}`);
    }
    return auth;
}
registerAuth("WebExtension" /* ClientPlatform.WEB_EXTENSION */);

export { getAuth };
//# sourceMappingURL=index.js.map
