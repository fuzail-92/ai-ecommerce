// Health service: contains business logic for health checks
const getHealthStatus = () => {
  return {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
};

module.exports = { getHealthStatus };
