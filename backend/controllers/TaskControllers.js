import fs from "fs";
import csvParser from "csv-parser";
import XLSX from "xlsx";
import Task from "../models/Task.js";
import User from "../models/User.js";

/**
 * Helper: read CSV file and return array of rows { FirstName, Phone, Notes }
 */
const parseCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

/**
 * Helper: read XLSX / XLS and return array of rows
 */
const parseXLSXFile = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
  return json;
};

/**
 * Validate rows
 */
const normalizeAndValidateRows = (rawRows) => {
  const normalized = [];

  for (const r of rawRows) {
    const firstName =
      r.FirstName ??
      r.firstname ??
      r.first_name ??
      r["First Name"] ??
      r["first name"] ??
      "";
    const phone =
      r.Phone ?? r.phone ?? r.PhoneNumber ?? r["Phone Number"] ?? "";
    const notes = r.Notes ?? r.notes ?? r.Note ?? r.note ?? "";

    if (!firstName || !phone) {
      return {
        valid: false,
        reason: "Each row must contain FirstName and Phone columns.",
      };
    }

    normalized.push({
      FirstName: String(firstName).trim(),
      Phone: String(phone).trim(),
      Notes: String(notes).trim(),
    });
  }

  return { valid: true, rows: normalized };
};

/**
 * Controller: upload CSV/XLSX and distribute tasks
 */
export const uploadAndDistribute = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const ext = req.file.originalname.split(".").pop().toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(ext)) {
      fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({ message: "Invalid file type. Allowed: csv, xlsx, xls" });
    }

    // Parse file
    let rawRows =
      ext === "csv"
        ? await parseCSVFile(req.file.path)
        : parseXLSXFile(req.file.path);

    // Validate rows
    const validated = normalizeAndValidateRows(rawRows);
    if (!validated.valid) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: validated.reason });
    }
    const rows = validated.rows;

    // Fetch all agents (ignore createdBy for now to ensure all dashboard agents get tasks)
    const agents = await User.find({ role: "agent" }).select("_id name email");
    if (!agents || agents.length === 0) {
      fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({ message: "No agents found to assign tasks." });
    }

    // Round-robin distribution
    const N = agents.length;
    const total = rows.length;
    const assignments = Array.from({ length: N }, () => []);

    let index = 0;
    for (let i = 0; i < total; i++) {
      assignments[index].push(rows[i]);
      index = (index + 1) % N;
    }

    // Save tasks in DB
    const tasksToInsert = [];
    for (let i = 0; i < N; i++) {
      const agentId = agents[i]._id;
      for (const r of assignments[i]) {
        tasksToInsert.push({
          firstName: r.FirstName,
          phone: r.Phone,
          notes: r.Notes,
          assignedTo: agentId,
          createdBy: req.user._id,
        });
      }
    }

    if (tasksToInsert.length > 0) await Task.insertMany(tasksToInsert);

    fs.unlinkSync(req.file.path);

    // Summary for frontend
    const summary = agents.map((a, i) => ({
      agent: { id: a._id, name: a.name, email: a.email },
      assignedCount: assignments[i].length,
      assigned: assignments[i],
    }));

    return res.status(200).json({
      message: "File processed and tasks distributed successfully",
      totalRows: total,
      agentCount: N,
      distribution: summary,
    });
  } catch (err) {
    console.error("uploadAndDistribute error:", err);
    try {
      if (req.file?.path && fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path);
    } catch (e) {}
    return res.status(500).json({ message: "Server error" });
  }
};

// Mark a task as completed (agent only)
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task status updated", task: updatedTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update task status" });
  }
};
