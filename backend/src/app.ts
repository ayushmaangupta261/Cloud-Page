import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoute";
import noteRoutes from "./routes/noteRoute";

const app = express();

// Allowed origins
const allowedOrigins = [
  "https://ayushmaangupta261.github.io", 
  "https://ayushmaangupta261.github.io/Highway-Delight-Assignment", 
  "http://localhost:3000"
];

// Enable CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
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
