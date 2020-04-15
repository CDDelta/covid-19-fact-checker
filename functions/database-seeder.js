const admin = require('firebase-admin');
const crypto = require('crypto');
const fs = require('fs');

admin.initializeApp({
    credential: admin.credential.cert('../firebase-cert.json'),
});

const firestore = admin.firestore();

const mockClaims = JSON.parse(fs.readFileSync('./mock-claims.json'));

for (let claim of mockClaims) {
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
            countryCodes: distribute(claim.hitCountryCodes.length, dayCount).reduce(
                (map, countryCount, i) => {
                    map[claim.hitCountryCodes[i]] = countryCount;
                    return map;
                },
                {}),
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

function distribute(length, value) {
    if (length <= 1)
        return [value];
    var half = Math.floor(length / 2),
        dist = Math.floor(Math.random() * value);
    return distribute(half, dist).concat(distribute(length - half, value - dist));
}

