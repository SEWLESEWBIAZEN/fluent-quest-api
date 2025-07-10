var admin = require("firebase-admin");

// var serviceAccount = require("../../fluent-quest.Api/config/firebase-private-key.json");

// for prod
var serviceAccount = require("./firebase-private-key.json");
// {
//   "type": process.env.FIREBASE_TYPE,
//   "project_id": process.env.FIREBASE_PROJECT_ID,
//   "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
//   "private_key": process.env.FIREBASE_PRIVATE_KEY,
//   "client_email": process.env.FIREBASE_CLIENT_EMAIL,
//   "client_id": process.env.FIREBASE_CLIENT_ID,
//   "auth_uri": process.env.FIREBASE_AUTH_URI,
//   "token_uri": process.env.FIREBASE_TOKEN_URI,
//   "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
//   "client_x509_cert_url": process.env.FIREBASE_AUTH_CLIENT_URL,
//   "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
// }
// require("../../fluent-quest.Api/config/firebase-private-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || ""
});

module.exports = admin
