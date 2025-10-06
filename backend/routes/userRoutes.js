import express from "express";
import { getMe, loginUser, registerUser } from "../controllers/UserControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
