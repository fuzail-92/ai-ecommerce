const healthService = require("./health.service");

// Health controller: handles request and response
const getHealth = (req, res) => {
  const healthData = healthService.getHealthStatus();
  res.json(healthData);
};

module.exports = { getHealth };
