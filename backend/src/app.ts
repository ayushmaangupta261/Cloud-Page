import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoute";
import noteRoutes from "./routes/noteRoute";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Allowed origins
const allowedOrigin = process.env.CORS_URL; // single origin

console.log("allowed origin -> ", allowedOrigin);


app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // allow cookies
  })
);


// Parse JSON requests
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

export default app;
