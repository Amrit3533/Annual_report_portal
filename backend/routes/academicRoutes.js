const express = require("express");
const router = express.Router();
const {
  getAcademicData,
  createAcademicData,
  updateAcademicData,
  deleteAcademicData
} = require("../controllers/academicController");

router.get("/", getAcademicData);
router.post("/", createAcademicData);
router.put("/:id", updateAcademicData);
router.delete("/:id", deleteAcademicData);

module.exports = router;