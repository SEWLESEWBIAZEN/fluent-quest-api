const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const connectDB = require('./utils/connectDB')
const corsMiddleware = require('./config/corsConfig');
const { createResponse } = require('./utils/responseHelper')
const multer = require('multer');



dotenv.config()
// port the app listen to
const port = process.env.PORT || 8000
const host = process.env.HOSTNAME || 'localhost'

// app
const app = express();

connectDB();

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(corsMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'))

// routes
const routes = require('./routes')
app.use('/api', routes)

// error handling middleware
app.use((err, req, res, next) => { 
console.log(err)
  res.status(res.statusCode || 500).json(createResponse ({statusCode: res.statusCode || 500, success:res.success || false, message:res.message || err || 'Internal Server Error', data: res.data || null }));
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
