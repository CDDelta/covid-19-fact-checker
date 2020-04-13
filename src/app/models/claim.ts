import * as firebase from 'firebase';

export interface Claim {
    id: string;
    content: string;
    hitCount: number;
    checked: boolean;
    factCheckerLinks: string[];
    dateAdded: firebase.firestore.Timestamp;
}