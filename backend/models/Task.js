const mongoose = require("mongoose");
const user = require("./User")

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
})

const task = mongoose.model("task", taskSchema);

module.exports = task;