/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { https } from 'firebase-functions';
// import { Server } from 'http';
import { Server } from '../build/server/index.js';
import { manifest } from '../build/server/manifest.js';

const app = new Server(manifest);

export const ssrServer = https.onRequest((request, response) => {
  app.render(request, response);
});