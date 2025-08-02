if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const express = require('express');
const injectExpress = require('./fluent-quest.Services/dependency-manager/inject-express');
const injectRateLimiter = require('./fluent-quest.Services/dependency-manager/inject-rate-limiter');
const path = require('path')

const app = express();
injectExpress(app);
injectRateLimiter(app);
app.use('/contentUploads', express.static(path.join(__dirname, '/fluent-quest.api/public/contentUploads')))
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 8000;
  const host = process.env.HOSTNAME || '0.0.0.0';

  app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
  });
} else {
  module.exports = { app };
}



