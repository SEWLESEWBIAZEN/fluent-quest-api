const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs:  15* 60 * 1000, 
  max: 10,                 
  message: 'Too many requests from this IP, please try again later.',  
});

module.exports = (app) => {
    app.use('/api', limiter); 
    console.log('Rate limiter injected successfully');
    return app;
}


