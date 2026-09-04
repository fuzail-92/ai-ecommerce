const { Queue } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis('redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
});

// Create queues
const emailQueue = new Queue('email', { connection });

module.exports = {
  emailQueue,
  connection,
};
