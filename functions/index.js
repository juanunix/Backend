// Required libraries
const functions = require('firebase-functions');
const admin = require("firebase-admin");
var serviceAccount = require("./servicekey.json");
var cDate = new Date();

// Update cat location
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

// New Cat
exports.newCat = functions.https.onRequest((req, res) => {
    var q = req.query;
    var dataStuff = {
        "Identifier": q.catId,
        "Photo URI": q.photoURI,
        "Location": {
            "General Location": "undefined",
            "Specific Location": [{
                "Specific Location": {
                    "Location Identifier": "undefined",
                    "Timestamps": [cDate]
                }
            }]
        }
    };

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    var db = admin.firestore();

    var addDoc = db.collection('users').doc(q.userId).collection('Cats').add(dataStuff).then(ref => {
        var response = {
            "Response Code": 201,
            "Success": true,
            "Document ID": ref.id
        };
        res.status(201).send(response);
    });
    return "200";
});

// New User Defined Location
exports.newLoc = functions.https.onRequest((req, res) => {
    var q = req.query;
    var dataStuff = {
        "General Location": q.genLoc,
        "Specific Location": q.specLoc,
        "Identifier": q.locId
    };

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    var db = admin.firestore();

    var addDoc = db.collection('users').doc(q.userId).collection('Locations').add(dataStuff).then(ref => {
        var response = {
            "Response Code": 201,
            "Success": true,
            "Document ID": ref.id
        };
        res.status(201).send(response);
    });
    return "200";
});

// Update cat details
exports.setCat = functions.https.onRequest((req, res) => {
    var q = req.query;
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    var db = admin.firestore();

    var docRef = db.collection('users').doc(q.userId).collection('Cats').doc(q.catId);

    var dataStuff = docRef.set({
        "Identifier": q.catName,
        "Photo URI": q.photoURI
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

// Get Cats
exports.getCats = functions.https.onRequest((req, res) => {
    var userID = req.query.userID;
    let endpoint = "https://firestore.googleapis.com/v1beta1/projects/te-cattrack/databases/(default)/documents/users/";
    request(endpoint + userID + "/Cats", function (error, response, body) {
        body = JSON.parse(body);
        var cats = [];
        body.documents.forEach(cat => {
            cats.push(cat.fields.Identifier.stringValue);
        });
        res.status(200).send(cats);
        return "200";
    });
});

// Get cat location
exports.getCatLocation = functions.https.onRequest((req, res) => {
    var userID = req.query.userID;
    var catID = req.query.catID;
    let endpoint = "https://firestore.googleapis.com/v1beta1/projects/te-cattrack/databases/(default)/documents/users/";
    request(endpoint + userID + "/Cats/" + catID, function (error, response, body) {
        generalLocation = JSON.parse(body).fields.Location.mapValue.fields["General Location"]["stringValue"];
        specificLocation = JSON.parse(body).fields.Location.mapValue.fields["Specific Location"]["mapValue"];
        res.status(200).send({"General Location":generalLocation, "Specific Location": specificLocation});
        return "200";
    });
});

exports.simpleReturn = functions.https.onRequest((req, res) => {
    res.status(200).send(res);
    return "200";
});