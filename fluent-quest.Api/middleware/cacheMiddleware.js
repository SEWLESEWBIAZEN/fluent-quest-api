const redisClient = require('../../fluent-quest.Services/dependency-manager/redisClient');
const { createResponse } = require('../../fluent-quest.Services/utils/responseHelper');
const crypto = require('crypto');

const redisCacheMiddleware = (durationInSec = 600) => {
  return async (req, res, next) => {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    //For best practice: normalize query params and include HTTP method (GET, POST, etc.)
    url.searchParams.sort(); 
    const rawKey = `${req.method}:${url.pathname}?${url.searchParams.toString()}`;
    //hash the result if you want fixed-length Redis keys.
    const key = crypto.createHash('sha256').update(rawKey).digest('hex');

    try {
      const cachedRaw = await redisClient.get(key);
      if (cachedRaw) {
        const cachedResponse = JSON.parse(cachedRaw);
        cachedResponse.fromCache = true;
        return res.status(cachedResponse.statusCode || 200).json(cachedResponse);
      }

      // Saves the original Express res.json() function so it can still be called later.
      //bind(res) ensures the this context is preserved
      const originalJson = res.json.bind(res);

      //Replaces res.json() with a custom version that does extra work before sending the response.
      res.json = async (body) => {
        //Ensures the response follows your app's standard response format
        const responseToCache = createResponse({
          statusCode: body?.statusCode ?? 200,
          success: body?.success ?? true,
          message: body?.message ?? 'Success',
          data: body?.data ?? null,
        });

        //If the response was successful (success: true), it caches the response in Redis.
        //key is the Redis cache key (likely based on the request URL or params).
        //durationInSec controls how long the response stays cached
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
