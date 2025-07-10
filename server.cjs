// if (process.env.NODE_ENV !== 'production') {
//     process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// }

(async () => {
  const express = require('express');
  const injectExpress = require('./fluent-quest.Services/dependency-manager/inject-express');
  const injectRateLimiter = require('./fluent-quest.Services/dependency-manager/inject-rate-limiter');
  const corsMiddleware = require('./fluent-quest.Api/config/corsConfig');

  const app = express();
  app.use(corsMiddleware);

  await injectExpress(app);
  injectRateLimiter(app);

  if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 8000;
    const host = process.env.HOSTNAME || 'localhost';

    app.listen(port, host, () => {
      console.log(`Server running at http://${host}:${port}`);
    });
  } else {
    module.exports = { app };
  }
})();


