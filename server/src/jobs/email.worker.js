const { Worker } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis('redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
});

const worker = new Worker('email', async (job) => {
  console.log(`📧 Processing email job ${job.id}...`);
  console.log('Job data:', job.data);
  // Simulate email sending
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`✅ Email sent to ${job.data.to}`);
}, { connection });

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

console.log('Email worker started');
