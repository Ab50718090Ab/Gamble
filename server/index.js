import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";

import userRoutes from "./routes/user.route.js";
import oauthRoutes from "./routes/auth.route.js";
import betRoutes from "./routes/bet.route.js";
import razorpayRoutes from "./routes/razorpay.route.js";
import transactionRoutes from "./routes/transaction.routes.js";
import gamesRoutes from "./routes/gameRoutes/games.routes.js";

const app = express();
const port = process.env.PORT || 3000;

// DB connect
connectDB();

// =========================
// Middlewares
// =========================
app.use(express.json());
app.use(cookieParser());

// =========================
// CORS FIX (IMPORTANT)
// =========================
const allowedOrigins = [
  "http://localhost:5173",
  "https://gamble-1-6bq6.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow tools like Postman / server-to-server
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.trim();

      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      } else {
        console.log("❌ CORS blocked request from:", cleanOrigin);
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// =========================
// API Routes
// =========================
app.use("/api/user", userRoutes);
app.use("/api/auth", oauthRoutes);
app.use("/api/bet", betRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/razorpay", razorpayRoutes);
app.use("/api/games", gamesRoutes);

// =========================
// Test Route
// =========================
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// =========================
// Start Server
// =========================
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});