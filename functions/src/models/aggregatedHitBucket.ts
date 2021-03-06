import { firestore } from 'firebase-admin';

export interface AggregatedHitBucket {
  date: firestore.Timestamp;
  countryCodes: { [key: string]: number };
}
