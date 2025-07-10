const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const corsMiddleware = require('../../fluent-quest.Api/config/corsConfig');
const routes = require('../../fluent-quest.Api/routes');
const { createResponse } = require('../utils/responseHelper');
const connectDB = require('../utils/connectDB');
const dotenv = require('dotenv');

const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envPath });

module.exports =async (app) => {
    app.use(corsMiddleware);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(morgan('dev'));
    app.use(express.static('public'));
   await connectDB();
    app.use('/api', routes);
    // Global error handler
    app.use((err, req, res, next) => {
        res.status(err.statusCode || 500).json(
            createResponse({
                statusCode: err.statusCode || 500,
                success: false,
                message: err.message || 'Internal Server Error'
            })
        );
    });

};
