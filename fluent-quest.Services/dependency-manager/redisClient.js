const { createClient } = require('redis');

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = process.env.REDIS_PORT || 6379;

const redisClient = createClient({
  socket: {
    host: redisHost,
    port: redisPort,
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect();

module.exports = redisClient;
