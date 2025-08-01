const { createClient } = require('redis');

const redisClient = createClient({
  socket: {
    host: 'redis',  
    port: 6379
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect();

module.exports = redisClient;
