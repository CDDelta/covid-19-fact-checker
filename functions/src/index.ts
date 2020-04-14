import * as admin from 'firebase-admin';

admin.initializeApp();

export { onMessageReceived } from './onMessageReceived';
export { processClaimHit } from './processClaimHit';
