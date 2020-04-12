import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import * as twillio from 'twilio';
import { Claim } from './models/claim';
import { FactCheck } from './models/factCheck';

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
    const factQuery = await firestore.collection('fact-checks').where('claims', 'array-contains', claimId).limit(1).get();

    if (!factQuery.empty) {
        const factCheck = factQuery.docs[0].data() as FactCheck;

        await firestore.doc(`claims/${claimId}`).update({
            hitCount: admin.firestore.FieldValue.increment(1),
        });

        twiml.message(`Here's what I found on this claim:${factCheck.links.map((l) => '\n' + l)}`);
    } else {
        await firestore.doc(`claims/${claimId}`).create({
            content: receivedMsg,
            hitCount: 1,
            checked: false
        } as Claim);

        twiml.message(`I have never seen this claim before, but I have logged it for checking.`);
    }

    response.writeHead(200, { 'Content-Type': 'text/xml' });
    response.end(twiml.toString());
});
