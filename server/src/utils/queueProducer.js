const { emailQueue } = require('../config/queue');

// Add email to queue
const addEmailJob = async (to, subject, body) => {
  const job = await emailQueue.add('send-email', {
    to,
    subject,
    body,
  });
  return job;
};

module.exports = {
  addEmailJob,
};
