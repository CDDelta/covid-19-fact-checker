import * as admin from 'firebase-admin';

export enum Truthfulness {
  Unverified = 'unverified',
  False = 'false',
  MostlyFalse = 'mostly_false',
  HalfTrue = 'half_true',
  MostlyTrue = 'mostly_true',
  True = 'true',
}

export interface Claim {
  content: string;
  hitCount: number;
  hitCountryCodes: string[];
  truthfulness: Truthfulness;
  factCheckerLinks: string[];
  dateAdded: admin.firestore.Timestamp;
}
