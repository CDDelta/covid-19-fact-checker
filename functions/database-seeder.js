const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp({
    credential: admin.credential.cert('../firebase-cert.json'),
});

const firestore = admin.firestore();

const claimExamples = [
    {
        content: `
        Did you know that this thing did this?
        
        Please forward to your friends and let them know!
        `,
        hitCount: 1,
        checked: false,
        factCheckerLinks: [],
    },
    {
        content: `
        I have a friend in the CIA who told me that aliens are visiting.
        
        Please forward to your friends and let them know!
        `,
        hitCount: 27,
        checked: true,
        factCheckerLinks: [
            'https://example.com/not-true',
        ],
    },
];

const batch = firestore.batch();

for (let claim of claimExamples) {
    const claimId = crypto.createHash('sha256').update(claim.content.toLowerCase().replace(/ /g, '')).digest('hex');;
    batch.set(firestore.doc(`claims/${claimId}`), {
        dateAdded: admin.firestore.FieldValue.serverTimestamp(),
        ...claim,
    });
}

batch.commit();