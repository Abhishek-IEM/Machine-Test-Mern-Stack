import express from "express";
import multer from "multer";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { updateTaskStatus, uploadAndDistribute } from "../controllers/TaskControllers.js";
import {
  seeTasksbyAgent,
  seeTasksByAgentId,
} from "../controllers/AgentControllers.js";

const router = express.Router();

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    if (["csv", "xls", "xlsx"].includes(ext)) cb(null, true);
    else cb(new Error("Invalid file type"));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("file"),
  uploadAndDistribute
);

router.get("/mytasks", protect, seeTasksbyAgent);
router.get("/agent/:id", protect, adminOnly, seeTasksByAgentId);
router.patch("/status/:id", protect, updateTaskStatus);

export default router;
