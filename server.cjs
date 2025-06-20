const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const connectDB = require('./utils/connectDB')

// port the app listen to
const port = process.env.PORT || 3000
dotenv.config()

// app
const app = express()

// connect to the database
connectDB()

//middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))


// routes
const routes = require('./routes')
app.use('/api', routes)


// error handling middleware
app.use((err, req, res, next) => {  
  res.status(res.statusCode || 500).json({ error: err || 'Internal Server Error' });
});

const hostname = process.env.HOSTNAME || 'localhost'
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
