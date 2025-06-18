const mongoose = require('mongoose');
function connectDB() {
    mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME || 'FLUENT_QUEST'
    }).then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
}

module.exports = connectDB;
