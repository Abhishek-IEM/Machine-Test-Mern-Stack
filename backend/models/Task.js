import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String, default: "" },

    // who this task was assigned to (agent)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // which admin uploaded this CSV / created this task distribution
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //status of the task "Pending" or "Done"
    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
