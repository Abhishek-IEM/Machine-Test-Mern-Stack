import express from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import { createAgent, deleteAgent, getAllAgents } from "../controllers/AgentControllers.js";

const router = express.Router();

router.post("/create-agent", protect, adminOnly, createAgent);
router.get("/all", protect, adminOnly, getAllAgents);
router.delete("/delete/:id", protect, adminOnly, deleteAgent);

export default router;
