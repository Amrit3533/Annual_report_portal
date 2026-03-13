const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  disableUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", verifyToken, authorizeRoles("admin"), createUser);
router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, authorizeRoles("admin"), getUserById);
router.put("/:id", verifyToken, authorizeRoles("admin"), updateUser);
router.put("/:id/disable", verifyToken, authorizeRoles("admin"), disableUser);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteUser);
module.exports = router;
