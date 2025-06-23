const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const connectDB = require('./utils/connectDB')

dotenv.config()

// port the app listen to
const port = process.env.PORT || 8000
const host = process.env.HOSTNAME || 'localhost'

// app
const app = express()

// connect to the database
connectDB()

//middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

// static files
app.use(express.static('public'))

// routes
const routes = require('./routes')
const { createResponse } = require('./utils/responseHelper')
app.use('/api', routes)

// error handling middleware
app.use((err, req, res, next) => {   
  res.status(res.statusCode || 500).json(createResponse ({statusCode: res.statusCode || 500, success:res.success || false, message:res.message || err || 'Internal Server Error', data: res.data || null }));
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
