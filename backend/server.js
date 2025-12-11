const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const { config } = require("./src/config/config");

dotenv.config();

const authRoutes = require("./src/routes/authRoutes");
const travelRoutes = require("./src/routes/travelRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();

// CORS
app.use(
  cors({
    origin: config.frontendOrigin,
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ status: "Global Travel Insight backend running" });
});

app.use("/auth", authRoutes);
app.use("/api", travelRoutes);
app.use("/api/admin", adminRoutes);

const PORT = config.port || 5000;

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });