import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import * as twillio from 'twilio';
import { Claim } from './models/claim';

const config = functions.config();
const firestore = admin.firestore();

export const onMessageReceived = functions.https.onRequest(async (request, response) => {
    if (!twillio.validateExpressRequest(request, config.twillio.auth_token)) {
        response.status(403).end();
        return;
    }

    const twiml = new twillio.twiml.MessagingResponse();

    const receivedMsg = (request.body.Body as string).trim();

    const claimId = crypto.createHash('sha256').update(receivedMsg.toLowerCase().replace(/ /g, '')).digest('hex');
    const claimDoc = await firestore.doc(`claims/${claimId}`).get();

    if (claimDoc.exists) {
        const claim = claimDoc.data() as Claim;

        await firestore.doc(`claims/${claimId}`).update({
            hitCount: admin.firestore.FieldValue.increment(1),
        });

        if (claim.factCheckerLinks.length)
            twiml.message(`Here's what I found regarding this claim:${claim.factCheckerLinks.map((l) => '\n' + l)}`);
        else
            twiml.message(`I have not fact checked this claim yet. Please check back later.`);
    } else {
        await firestore.doc(`claims/${claimId}`).create({
            content: receivedMsg,
            hitCount: 1,
            checked: false,
            factCheckerLinks: [],
            dateAdded: admin.firestore.FieldValue.serverTimestamp(),
        } as Omit<Claim, 'dateAdded'>);

        twiml.message(`I have never seen this claim before, but I have logged it for fact checking.`);
    }

    response.writeHead(200, { 'Content-Type': 'text/xml' });
    response.end(twiml.toString());
});
