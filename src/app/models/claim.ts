import * as firebase from 'firebase';

export enum Truthfulness { False = 'false', MostlyFalse = 'mostly_false', HalfTrue = 'half_true', MostlyTrue = 'mostly_true', True = 'true' };

export interface Claim {
    id: string;
    content: string;
    hitCount: number;
    hitCountryCodes: string[];
    checked: boolean;
    truthfulness: Truthfulness;
    factCheckerLinks: string[];
    dateAdded: firebase.firestore.Timestamp;
}