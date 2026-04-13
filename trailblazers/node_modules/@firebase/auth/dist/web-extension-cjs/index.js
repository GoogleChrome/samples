'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var register = require('./register-a20238ea.js');
var app = require('@firebase/app');
var util = require('@firebase/util');
require('@firebase/component');
require('@firebase/logger');

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
function getAuth(app$1 = app.getApp()) {
    const provider = app._getProvider(app$1, 'auth');
    if (provider.isInitialized()) {
        return provider.getImmediate();
    }
    const auth = register.initializeAuth(app$1, {
        persistence: [register.indexedDBLocalPersistence]
    });
    const authEmulatorHost = util.getDefaultEmulatorHost('auth');
    if (authEmulatorHost) {
        register.connectAuthEmulator(auth, `http://${authEmulatorHost}`);
    }
    return auth;
}
register.registerAuth("WebExtension" /* ClientPlatform.WEB_EXTENSION */);

exports.ActionCodeURL = register.ActionCodeURL;
exports.AuthCredential = register.AuthCredential;
exports.AuthErrorCodes = register.AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY;
exports.EmailAuthCredential = register.EmailAuthCredential;
exports.EmailAuthProvider = register.EmailAuthProvider;
exports.FacebookAuthProvider = register.FacebookAuthProvider;
exports.GithubAuthProvider = register.GithubAuthProvider;
exports.GoogleAuthProvider = register.GoogleAuthProvider;
exports.OAuthCredential = register.OAuthCredential;
exports.OAuthProvider = register.OAuthProvider;
exports.PhoneAuthCredential = register.PhoneAuthCredential;
exports.SAMLAuthProvider = register.SAMLAuthProvider;
exports.TotpMultiFactorGenerator = register.TotpMultiFactorGenerator;
exports.TotpSecret = register.TotpSecret;
exports.TwitterAuthProvider = register.TwitterAuthProvider;
exports.applyActionCode = register.applyActionCode;
exports.beforeAuthStateChanged = register.beforeAuthStateChanged;
exports.checkActionCode = register.checkActionCode;
exports.confirmPasswordReset = register.confirmPasswordReset;
exports.connectAuthEmulator = register.connectAuthEmulator;
exports.createUserWithEmailAndPassword = register.createUserWithEmailAndPassword;
exports.debugErrorMap = register.debugErrorMap;
exports.deleteUser = register.deleteUser;
exports.fetchSignInMethodsForEmail = register.fetchSignInMethodsForEmail;
exports.getAdditionalUserInfo = register.getAdditionalUserInfo;
exports.getIdToken = register.getIdToken;
exports.getIdTokenResult = register.getIdTokenResult;
exports.getMultiFactorResolver = register.getMultiFactorResolver;
exports.inMemoryPersistence = register.inMemoryPersistence;
exports.indexedDBLocalPersistence = register.indexedDBLocalPersistence;
exports.initializeAuth = register.initializeAuth;
exports.initializeRecaptchaConfig = register.initializeRecaptchaConfig;
exports.isSignInWithEmailLink = register.isSignInWithEmailLink;
exports.linkWithCredential = register.linkWithCredential;
exports.multiFactor = register.multiFactor;
exports.onAuthStateChanged = register.onAuthStateChanged;
exports.onIdTokenChanged = register.onIdTokenChanged;
exports.parseActionCodeURL = register.parseActionCodeURL;
exports.prodErrorMap = register.prodErrorMap;
exports.reauthenticateWithCredential = register.reauthenticateWithCredential;
exports.reload = register.reload;
exports.revokeAccessToken = register.revokeAccessToken;
exports.sendEmailVerification = register.sendEmailVerification;
exports.sendPasswordResetEmail = register.sendPasswordResetEmail;
exports.sendSignInLinkToEmail = register.sendSignInLinkToEmail;
exports.setPersistence = register.setPersistence;
exports.signInAnonymously = register.signInAnonymously;
exports.signInWithCredential = register.signInWithCredential;
exports.signInWithCustomToken = register.signInWithCustomToken;
exports.signInWithEmailAndPassword = register.signInWithEmailAndPassword;
exports.signInWithEmailLink = register.signInWithEmailLink;
exports.signOut = register.signOut;
exports.unlink = register.unlink;
exports.updateCurrentUser = register.updateCurrentUser;
exports.updateEmail = register.updateEmail;
exports.updatePassword = register.updatePassword;
exports.updateProfile = register.updateProfile;
exports.useDeviceLanguage = register.useDeviceLanguage;
exports.validatePassword = register.validatePassword;
exports.verifyBeforeUpdateEmail = register.verifyBeforeUpdateEmail;
exports.verifyPasswordResetCode = register.verifyPasswordResetCode;
exports.getAuth = getAuth;
//# sourceMappingURL=index.js.map
