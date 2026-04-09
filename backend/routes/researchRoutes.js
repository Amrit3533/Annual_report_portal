const express = require("express");
const router = express.Router();

const {
  getResearch,
  createResearch,
  deleteResearch
} = require("../controllers/researchController");

const { verifyToken } = require("../middleware/authMiddleware");

// GET
router.get("/", verifyToken, getResearch);

// POST
router.post("/", verifyToken, createResearch);

// DELETE
router.delete("/:id", verifyToken, deleteResearch);

module.exports = router;