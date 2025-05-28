const task = require("../models/Task");
const { findOne } = require("../models/User");
//const { findOne, findOneAndDelete, findOneAndUpdate } = require("../models/User");

async function allTask(req, res) {
    try {
        const tasks = await task.find({ user: req.user._id })
        res.status(200).json({ tasks });
    }
    catch (err) {
        res.json({ error: "error finding in database" })
    }
}


async function registerTask(req, res) {
    if (!req.body) {
        return res.status(401).json({ error: "Must provide required data" });
    }
    const { title, description } = req.body;
    if (!title) {
        return res.status(401).json({ error: "Must provide required data" });
    }
    try {
        const registeredTask = await task.create({ title, description, user: req.user._id });
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
        
        res.status(200).json({findingTask});
    }
    catch (err) {
        res.status(500).json({ error: "Error to find task" })
    }
}

module.exports = { getTaskById, updateTask, deleteTask, allTask, registerTask };