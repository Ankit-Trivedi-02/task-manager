const express = require("express")
const router = express.Router();
const {allTask,registerTask}=require("../controllers/taskController")

router.get("/",allTask);
router.post("/",registerTask)

module.exports=router;