const { createClient } = require('redis');
const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = process.env.REDIS_PORT || 6379;

const redisClient = createClient({
  socket: {
    host: redisHost,
    port: redisPort,
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect();

// Add custom delPattern method
redisClient.delPattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error("Redis delPattern error:", err);
  }
};

module.exports = redisClient;
