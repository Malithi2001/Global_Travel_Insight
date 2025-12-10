require("dotenv").config();

const config = {
  port: process.env.PORT || 5000,
  mongoUri:
    process.env.MONGO_URI ||
    "mongodb://localhost:27017/global_travel_insight",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  apiKey: process.env.API_KEY || "dev-frontend-key",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",

  disable2FA: process.env.DISABLE_2FA === "true",

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM,
  },

  openWeatherKey: process.env.OPENWEATHER_API_KEY,
  travelApiKey: process.env.TRAVEL_API_KEY,
};

module.exports = { config };