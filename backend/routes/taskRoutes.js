const express = require("express")
const router = express.Router();
const { getTaskById, updateTask, deleteTask, allTask, registerTask } = require("../controllers/taskController")

router.get("/", allTask);
router.post("/", registerTask)
router.get("/:id", getTaskById)
router.patch("/:id", updateTask)
router.delete("/:id", deleteTask)

module.exports = router;