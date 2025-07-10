var admin = require("firebase-admin");

var serviceAccount = require("../../fluent-quest.Api/config/firebase-private-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || ""
});

module.exports = admin
