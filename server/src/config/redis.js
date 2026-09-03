const Redis = require('ioredis');
const config = require('../config/env');

const redis = new Redis(config.redisUrl || 'redis://localhost:6379', {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

module.exports = redis;
