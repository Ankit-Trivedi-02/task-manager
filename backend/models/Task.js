const mongoose = require("mongoose");
const user = require("./User")

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        completed: { type: Boolean, default: false },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        priority: { type: Number, default: 1 ,  },
        dueDate: { type: Date, default: "2025-06-10T23:59:59.000Z" }
    },
    { timestamps: true }  // ✅ Enable createdAt and updatedAt
)

const task = mongoose.model("task", taskSchema);

module.exports = task;