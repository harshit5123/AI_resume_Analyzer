require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => {
        console.log("Connected to database successfully");
    })
    .catch((err) => {
        console.log("Error while connecting to database:", err.message);
    });

