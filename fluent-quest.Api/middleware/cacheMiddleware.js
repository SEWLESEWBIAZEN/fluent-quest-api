// cacheMiddleware.js
const redisClient = require('../../fluent-quest.Services/dependency-manager/redisClient'); // adjust the path as needed

const redisCacheMiddleware = (durationInSec = 600) => {
  return async (req, res, next) => {
    const key = `data:${req.params.id || 'all'}:${req.user?.id || 'guest'}`;
    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        return res.json({ fromCache: true, data: JSON.parse(cachedData) });
      }
     
      const originalJson = res.json.bind(res);
      res.json = async (body) => {
        await redisClient.setEx(key, durationInSec, JSON.stringify(body));
        originalJson({ fromCache: false, data: body });
      };

      next();
    } catch (err) {
      console.error('Redis error in middleware:', err);
      next();
    }
  };
};

module.exports = { redisCacheMiddleware };
