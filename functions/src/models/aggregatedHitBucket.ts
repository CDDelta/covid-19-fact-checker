import { firestore } from 'firebase-admin';

export interface AggregatedHitBucket {
  date: firestore.Timestamp;
  countries: { [key: string]: number };
}
