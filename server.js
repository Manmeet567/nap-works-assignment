const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const { logRequests, logErrors, logger } = require("./middlewares/logger");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(logRequests);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.get("/test-server", (req, res) => {
  res.send("Server is working");
});

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

app.use(logErrors);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("connected to DB and server listening on port", PORT);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });
