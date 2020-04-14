import { firestore } from 'firebase-admin';

export interface RawHit {
  countryCode: string;
  dateAdded: firestore.Timestamp;
}
