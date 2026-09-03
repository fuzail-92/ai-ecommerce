const redis = require('../config/redis');
const AppError = require('../utils/appError');

// Basic fixed-window rate limiter
const rateLimiter = (windowSeconds = 60, maxRequests = 30) => {
  return async (req, res, next) => {
    if (redis.status !== 'ready') return next();

    const key = `rate:${req.ip}:${req.path}`;

    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, windowSeconds);
      }

      if (current > maxRequests) {
        throw new AppError('Too many requests, please try again later', 429);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = rateLimiter;
