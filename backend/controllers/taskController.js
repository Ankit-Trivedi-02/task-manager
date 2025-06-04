const task = require("../models/Task");
const { findOne, find } = require("../models/User");
//const { findOne, findOneAndDelete, findOneAndUpdate } = require("../models/User");

async function allTask(req, res) {
    let filter = { user: req.user._id };  // Start with filtering tasks by logged-in user
    let sort = {};                        // Initialize empty sort object

    try {
        // 1️⃣ Check if the 'completed' query parameter is provided
        if (req.query.completed !== undefined) {
            // Convert the string 'true' or 'false' to a boolean
            filter.completed = req.query.completed === 'true';
        }

        // 2️⃣ Check if the 'sortBy' query parameter exists
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':'); // Split string by ':' (e.g. "createdAt:desc")

            const field = parts[0];                    // Extract field to sort by (e.g. "createdAt/due date")

            // Determine sorting order: -1 for desc, 1 for asc (default)
            let order = parts[1] === 'desc' ? -1 : 1;
            if (field === `priority`) { order = 1 };
            sort[field] = order;                       // Dynamically set sort order for the field
        }
        // 3️⃣ Query tasks matching the filter, and apply sorting
        console.log(sort);
        const tasks = await task.find(filter).sort(sort);

        // 4️⃣ Send back the fetched tasks as JSON response
        res.status(200).json(tasks);
    } catch (err) {
        // If any error occurs, send 500 status with error message
        console.error("Server Error:", err);
        res.status(500).json({ err: "Error fetching your data" });
    }
}


async function registerTask(req, res) {
    if (!req.body) {
        return res.status(401).json({ error: "Must provide required data" });
    }
    const { title, description, dueDate, priority } = req.body;
    if (!title) {
        return res.status(401).json({ error: "Must provide required data" });
    }
    try {
        const registeredTask = await task.create({ title, description, user: req.user._id, dueDate, priority });
        res.status(201).json({ sucess: "Your task is registered", title: title, description: description })
    }
    catch (err) {
        res.json({ error: "Error registering your task" })
    }
}

async function updateTask(req, res) {
    if (!req.body || typeof req.body.completed !== 'boolean') {
        return res.status(400).json({ error: "'completed' must be provided and must be boolean" });
    }
    const { completed } = req.body;
    console.log(completed);
    const id = req.params.id;
    try {
        console.log(req.user._id, id, completed);
        const updatableTask = await task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { completed },
            { new: true });
        console.log(updatableTask);
        res.status(200).json({ updatableTask });
    }
    catch (error) {
        res.json({ error: "Error updating your task" })
    }
}


async function deleteTask(req, res) {
    const id = req.params.id;
    try {
        const deletedTask = await task.findOneAndDelete({ user: req.user._id, _id: id });
        res.status(200).json({ deletedTask });
    }
    catch (error) {
        res.json({ error: "Error updating your task" })
    }
}

async function getTaskById(req, res) {
    const id = req.params.id;
    try {
        const findingTask = await task.findOne({ user: req.user._id, _id: id })

        res.status(200).json({ findingTask });
    }
    catch (err) {
        res.status(500).json({ error: "Error to find task" })
    }
}

module.exports = { getTaskById, updateTask, deleteTask, allTask, registerTask };