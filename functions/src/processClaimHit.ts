import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ClaimHitPayload } from './models/claimHitPayload';
import { RawHit } from './models/rawHit';
import { AggregatedHitBucket } from './models/aggregatedHitBucket';

const firestore = admin.firestore();

export const processClaimHit = functions.pubsub
  .topic('claim-hits')
  .onPublish(async (message, context) => {
    const payload = message.json as ClaimHitPayload;

    console.log(`writing claim ${payload.claimId} hit data points...`);

    const batch = firestore.batch();
    const claimRef = firestore.doc(`claims/${payload.claimId}`);

    batch.update(claimRef, {
      hitCount: admin.firestore.FieldValue.increment(1),
      hitCountryCodes: admin.firestore.FieldValue.arrayUnion(
        payload.fromCountryCode,
      ),
    });

    batch.create(claimRef.collection('raw_hits').doc(context.eventId), {
      countryCode: payload.fromCountryCode,
      dateAdded: admin.firestore.FieldValue.serverTimestamp(),
    } as RawHit);

    const startOfDay = getStartOfDay();

    batch.set(
      claimRef
        .collection('daily_aggregated_hits')
        .doc(startOfDay.getTime().toString()),
      {
        date: admin.firestore.Timestamp.fromDate(startOfDay),
        countryCodes: {
          [payload.fromCountryCode]: admin.firestore.FieldValue.increment(1),
        },
      } as Omit<AggregatedHitBucket, 'countries'>,
      {
        merge: true,
      },
    );

    await batch.commit();
  });

function getStartOfDay(d = new Date()): Date {
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();

  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
}
