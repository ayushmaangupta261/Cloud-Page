import { Router } from "express";
import { signup, login } from "../controllers/authController"

const router = Router();

// Signup and login using email & password
router.post("/signup", signup);
router.post("/login", login);

export default router;
