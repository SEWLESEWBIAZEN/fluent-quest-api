const redisClient = require('../../fluent-quest.Services/dependency-manager/redisClient');
const { createResponse } = require('../../fluent-quest.Services/utils/responseHelper');

const redisCacheMiddleware = (durationInSec = 600) => {
  return async (req, res, next) => {
    const key = req.originalUrl;

    try {
      const cachedRaw = await redisClient.get(key);
      if (cachedRaw) {
        const cachedResponse = JSON.parse(cachedRaw);
        cachedResponse.fromCache = true;
        return res.status(cachedResponse.statusCode || 200).json(cachedResponse);
      }

      const originalJson = res.json.bind(res);

      res.json = async (body) => {
        const responseToCache = createResponse({
          statusCode: body?.statusCode ?? 200,
          success: body?.success ?? true,
          message: body?.message ?? 'Success',
          data: body?.data ?? null,
        });

        if (responseToCache?.success) {          
          await redisClient.setEx(key, durationInSec, JSON.stringify(responseToCache));
        }

        responseToCache.fromCache = false;
        return originalJson(responseToCache);
      };

      next();
    } catch (err) {
      console.error('Redis error in middleware:', err);
      next();
    }
  };
};

module.exports = { redisCacheMiddleware };
