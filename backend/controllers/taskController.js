const task = require("../models/Task");
const { findOne, find } = require("../models/User");
//const { findOne, findOneAndDelete, findOneAndUpdate } = require("../models/User");

async function allTask(req, res) {
    let filter = { user: req.user._id };  // Start with filtering tasks by logged-in user
    let sort = {};                        // Initialize empty sort object

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * (limit);
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
            const order = parts[1] === 'desc' ? -1 : 1;
            sort[field] = order;                       // Dynamically set sort order for the field
        }
        // 3️⃣ Query tasks matching the filter, and apply sorting
        if (req.query.start || req.query.end) {
            filter.dueDate = {};
            if (req.query.start) {
                filter.dueDate.$gte = new Date(req.query.start);
            }
            if (req.query.end) {
                filter.dueDate.$lte = new Date(req.query.end);
            }
        }
        if (req.query.search) {
            const search = req.query.search;
            filter.title = { $regex: search, $options: "i" };
        }
        const tasks = await task.find(filter).sort(sort).skip(skip).limit(limit);
        const total = await task.countDocuments(filter);
        
        // 4️⃣ Send back the fetched tasks as JSON response
        res.status(200).json({
            success: true,
            page,
            limit,
            totalTasks: total,
            totalPages: Math.ceil(total / limit),
            tasks,
        });
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
    const { title, description, completed, priority, dueDate } = req.body;
    console.log(completed);
    const id = req.params.id;
    try {
        const updatableTask = await task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { title, description, completed, priority, dueDate },
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