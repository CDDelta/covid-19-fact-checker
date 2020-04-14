import { firestore } from 'firebase';

export interface AggregatedHitBucket {
  date: firestore.Timestamp;
  countryCodes: { [key: string]: number };
}
