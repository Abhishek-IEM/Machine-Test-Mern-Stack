import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

//connect to database
await connectDb();

const port = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/user", userRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
