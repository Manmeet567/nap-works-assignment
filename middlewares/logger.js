const winston = require("winston");
const path = require("path");
const fs = require("fs");

const logDirectory = path.join(__dirname, "../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, "requests.log"),
    }), 
    new winston.transports.File({
      filename: path.join(logDirectory, "errors.log"),
      level: "error",
    }), 
  ],
});

const logRequests = (req, res, next) => {
  const { method, url } = req;
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      method,
      url,
      status: res.statusCode,
      responseTime: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  });

  next();
};

const logErrors = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
  res.status(500).json({ error: "Internal Server Error" });
};

module.exports = { logRequests, logErrors, logger };
