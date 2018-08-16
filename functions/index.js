// Required libraries
const functions = require('firebase-functions');
const admin = require("firebase-admin");
var serviceAccount = require("./servicekey.json");
var cDate = new Date();

exports.setLoc = functions.https.onRequest((req, res) => {
    var q = req.query;
    var reqres = {
        "userId": q.userId,
        "catId": q.catId,
        "location": q.location,
        "locId": q.locId
    };

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    var db = admin.firestore();

    var docRef = db.collection('users').doc(reqres.userId).collection('Cats').doc(reqres.catId);

    var dataStuff = docRef.set({
        "Location": {
            "General Location": reqres.location,
            "Specific Location": [{
                "Specific Location": {
                    "Location Identifier": reqres.locId,
                    "Timestamps": [cDate]
                }
            }]
        }
    }, {
        merge: true
    });
    var response = {
        "Response Code": 200,
        "Success": true,
        "Additional Info": "None"
    };
    res.status(200).send(response);
    return "200";
});

exports.newCat = functions.https.onRequest((req, res) => {
    var q = req.query;
    var reqres = {
        "userId": q.userId,
        "catId": q.catId,
        "location": q.location,
        "locId": q.locId
    };
    var dataStuff = {
        "Identifier": q.catId,
        "Location": {
            "General Location": reqres.location,
            "Specific Location": [{
                "Specific Location": {
                    "Location Identifier": reqres.locId,
                    "Timestamps": [cDate]
                }
            }]
        }
    };

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    var db = admin.firestore();

    var addDoc = db.collection('users').doc(reqres.userId).collection('Cats').add(dataStuff).then(ref => {
        var response = {
            "Response Code": 201,
            "Success": true,
            "Document ID": ref.id
        };
        res.status(201).send(response);
    });
    return "200";
});

exports.newLoc = functions.https.onRequest((req, res) => {
    var q = req.query;
    var reqres = {
        "userId": q.userId,
        "genLoc": q.genLoc,
        "specLoc": q.specLoc,
        "locId": q.locId
    };
    var dataStuff = {
        "General Location": reqres.genLoc,
        "Specific Location": reqres.specLoc,
        "Identifier": reqres.locId
    };

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    var db = admin.firestore();

    var addDoc = db.collection('users').doc(reqres.userId).collection('Locations').add(dataStuff).then(ref => {
        var response = {
            "Response Code": 201,
            "Success": true,
            "Document ID": ref.id
        };
        res.status(201).send(response);
    });
    return "200";
});