const express = require("express")
const router = express.Router();
const { updateTask, deleteTask, allTask, registerTask } = require("../controllers/taskController")

router.get("/", allTask);
router.post("/", registerTask)
router.patch("/:id", updateTask)
router.delete("/:id", deleteTask)

module.exports = router;