import dotenv from "dotenv";
import app from "./app";
import connectDB from "./utils/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI!);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT : ${PORT}`);
});
