const express = require("express");
const router = express.Router();

const { createDepartment, getDepartments } =
require("../controllers/departmentController");

const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createDepartment);
router.get("/", verifyToken, getDepartments);

module.exports = router;