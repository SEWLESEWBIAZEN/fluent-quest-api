const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const corsMiddleware = require('../../fluent-quest.Api/config/corsConfig');
const routes = require('../../fluent-quest.Api/routes');
const { createResponse } = require('../utils/responseHelper');
const connectDB = require('../utils/connectDB');
const dotenv = require('dotenv');
const path = require('path')

//<summary>
// Loads environment variables from a specific .env file based on the current NODE_ENV value;
// uses '.env.test' during testing and defaults to '.env' otherwise
//</summary>
const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envPath });

module.exports = async (app) => {
    //<summary>
    // It enables Cross-Origin Resource Sharing (CORS) for your API, allowing it to be accessed from different origins.
    app.use(corsMiddleware);
    //</summary>

    //<summary>
    // Parses incoming requests with JSON payloads and makes the data available in req.body
    app.use(express.json({ limit: '20mb' }));
    // app.use(bodyParser.json());
    //</summary>

    //<summary>
    // It reads data sent from forms (like <form method="POST">) and makes it available in req.body.
    // Without it, req.body would be undefined for form submissions.
    // app.use(bodyParser.urlencoded({ extended: true }));

    app.use(express.urlencoded({ extended: true, limit: '20mb' }));

    //</summary>

    //<summary>
    // It logs brief details about each incoming HTTP request to your console in a color-coded and concise format.
    app.use(morgan('dev'));
    //</summary>

    //<summary>
    //It tells Express to serve static files (like images, CSS, JS, fonts) from the public directory


    //</summary>

    //</summary>

    //<summary>
    //Connects to the database before handling any incoming requests
    await connectDB();
    //</summary>

    //<summary>
    //Mounts all API route handlers under the '/api' path
    app.use('/api', routes);
    //</summary>

    //<summary>
    // Global error handling middleware that catches any errors passed down the middleware chain,
    // sets an appropriate status code, and sends a structured JSON response to the client
    //</summary>
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(err.statusCode || 500)
            .json(
                createResponse({
                    statusCode: err.statusCode || 500,
                    success: false,
                    message: err.message || 'Internal Server Error'
                })
            );
    });
};
