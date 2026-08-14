const pino = require("pino");
const config = require("../config/env");

// Create a Pino logger instance
const logger = pino({
  level: config.nodeEnv === "development" ? "debug" : "info",
  ...(config.nodeEnv === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }
    : {}),
});

module.exports = logger;
