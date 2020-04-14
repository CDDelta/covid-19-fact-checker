const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp({
    credential: admin.credential.cert('../firebase-cert.json'),
});

const firestore = admin.firestore();

const claimExamples = [
    {
        content: `Did you know that this thing did this?\nPlease forward to your friends and let them know!`,
        hitCount: 212,
        hitCountryCodes: ['AU'],
        truthfulness: 'mostly_true',
        factCheckerLinks: [],
    },
    {
        content: `I have a friend in the CIA who told me that aliens are visiting.\nPlease forward to your friends and let them know!`,
        hitCount: 27,
        hitCountryCodes: ['US'],
        truthfulness: 'false',
        factCheckerLinks: ['https://example.com/not-true'],
    },
];

for (let claim of claimExamples) {
    const batch = firestore.batch();

    const claimId = crypto
        .createHash('sha256')
        .update(claim.content.toLowerCase().replace(/\W/g, ''))
        .digest('hex');
    const claimRef = firestore.doc(`claims/${claimId}`);

    batch.set(claimRef, {
        dateAdded: admin.firestore.FieldValue.serverTimestamp(),
        ...claim,
    });

    let countLeft = claim.hitCount;

    for (let i = 0; i < 7; i++) {
        const bucketDate = getStartOfPastDay(i);

        const dayCount = Math.floor(countLeft / 2);
        countLeft -= dayCount;

        batch.set(claimRef.collection('daily_aggregated_hits').doc(bucketDate.getTime().toString()), {
            date: admin.firestore.Timestamp.fromDate(bucketDate),
            countryCodes: {
                'US': Math.floor(dayCount * 3 / 4),
                'AU': Math.floor(dayCount / 4),
            },
        });
    }

    batch.commit();
}

function getStartOfPastDay(daysBefore) {
    const d = new Date();
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();

    return new Date(Date.UTC(year, month, day - daysBefore, 0, 0, 0, 0));
}

