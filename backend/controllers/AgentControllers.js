import User from "../models/User.js";
import Task from "../models/Task.js";

// Create Agent
export const createAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Validate input
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if agent with same email exists
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Agent already exists" });

    // Create agent
    const agent = await User.create({
      name,
      email,
      mobile,
      password,
      role: "agent",
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Agent created successfully",
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
        role: agent.role,
        createdBy: agent.createdBy,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//view all agents
export const getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({
      role: "agent",
      createdBy: req.user._id,
    }).select("name email mobile role createdBy");

    const agentsWithTaskCount = await Promise.all(
      agents.map(async (agent) => {
        const count = await Task.countDocuments({ assignedTo: agent._id });
        return { ...agent.toObject(), taskCount: count };
      })
    );

    res.status(200).json({
      message: "Agents fetched successfully",
      total: agents.length,
      agents: agentsWithTaskCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Agent views their tasks
export const seeTasksbyAgent = async (req, res) => {
  try {
    const { status } = req.query; // "pending" | "completed"
    const filter = { assignedTo: req.user._id };

    if (status === "completed") filter.completed = true;
    else if (status === "pending") filter.completed = false;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin views tasks of a specific agent
export const seeTasksByAgentId = async (req, res) => {
  try {
    const agentId = req.params.id;
    const tasks = await Task.find({ assignedTo: agentId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Agent(Admin Only)
export const deleteAgent = async (req, res) => {
  try {
    const agentId = req.params.id;

    // Delete the agent
    const agent = await User.findByIdAndDelete(agentId);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Delete tasks assigned to this agent
    await Task.deleteMany({ assignedTo: agentId });

    res.json({ message: "Agent deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting agent" });
  }
};