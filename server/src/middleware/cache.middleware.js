const redis = require('../config/redis');

// Cache middleware for GET endpoints
const cacheMiddleware = (ttl = 60) => {
  return async (req, res, next) => {
    // Skip if Redis is not connected
    if (redis.status !== 'ready') return next();

    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }

      // Monkey patch res.json to cache response
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        redis.setex(key, ttl, JSON.stringify(body)).catch(() => {});
        return originalJson(body);
      };

      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = cacheMiddleware;
