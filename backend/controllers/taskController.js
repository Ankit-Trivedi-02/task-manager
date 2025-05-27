const task = require("../models/Task");

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

module.exports = { allTask, registerTask };