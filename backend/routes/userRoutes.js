const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
} = require("../controllers/userController");

const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", verifyToken, authorizeRoles("admin"), createUser);
router.get("/", verifyToken, authorizeRoles("admin"), getUsers);
router.get("/:id", verifyToken, authorizeRoles("admin"), getUserById);

module.exports = router;
