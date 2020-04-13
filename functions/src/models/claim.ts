import * as admin from 'firebase-admin';

export interface Claim {
    content: string;
    hitCount: number;
    checked: boolean;
    factCheckerLinks: string[];
    dateAdded: admin.firestore.Timestamp;
}