var admin = require("firebase-admin");

var serviceAccount = require("../config/firebase-private-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin