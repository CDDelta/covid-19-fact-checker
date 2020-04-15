import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import { PubSub } from '@google-cloud/pubsub';
import * as twilio from 'twilio';
import { Claim, Truthfulness } from './models/claim';
import { ClaimHitPayload } from './models/claimHitPayload';

const config = functions.config();
const firestore = admin.firestore();
const pubSubClient = new PubSub();

export const onMessageReceived = functions.https.onRequest(
  async (request, response) => {
    if (process.env.NODE_ENV === 'production') {
      if (
        !twilio.validateExpressRequest(request, config.twilio.auth_token, {
          url: `https://${process.env.FUNCTION_REGION}-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/${process.env.FUNCTION_NAME}`,
        })
      ) {
        response.status(403).end();
        return;
      }
    }

    const payload = request.body as {
      Body: string;
      FromCountry: string;
    };

    const twiml = new twilio.twiml.MessagingResponse();

    if (payload.Body.trimLeft().startsWith('/')) {
      const receivedMsg = payload.Body.trimLeft().replace('/', '').trimRight();

      console.log('getting claim document...');

      const claimId = crypto
        .createHash('sha256')
        .update(receivedMsg.toLowerCase().replace(/\W/g, ''))
        .digest('hex');
      const claimDoc = await firestore.doc(`claims/${claimId}`).get();

      if (claimDoc.exists) {
        console.log(`claim exists as ${claimId}.`);

        const claim = claimDoc.data() as Claim;

        if (claim.factCheckerLinks.length)
          twiml.message(
            `Here's what I found regarding this claim:${claim.factCheckerLinks.map(
              (l) => '\n' + l,
            )}`,
          );
        else
          twiml.message(
            `I have not fact checked this claim yet. Please check back later.`,
          );
      } else {
        console.log(`claim does not exist, creating claim ${claimId}...`);

        await firestore.doc(`claims/${claimId}`).create({
          content: receivedMsg,
          hitCount: 0,
          truthfulness: Truthfulness.Unverified,
          hitCountryCodes: [],
          factCheckerLinks: [],
          dateAdded: admin.firestore.FieldValue.serverTimestamp(),
        } as Omit<Claim, 'dateAdded'>);

        twiml.message(
          `I have never seen this claim before, but I have logged it for fact checking.`,
        );
      }

      console.log('publishing claim hit message...');

      const hitId = await pubSubClient.topic('claim-hits').publishJSON({
        claimId,
        fromCountryCode: payload.FromCountry ?? 'unknown',
      } as ClaimHitPayload);

      console.log(`published hit ${hitId} message.`);
    } else {
      twiml.message(
        'To fact check a claim, start it with "/" and send it to me.',
      );
    }

    response.writeHead(200, { 'Content-Type': 'text/xml' });
    response.end(twiml.toString());
  },
);
