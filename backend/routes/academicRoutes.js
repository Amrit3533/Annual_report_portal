const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const { addAcademicData } = require("../controllers/academicController");

router.post(
    "/",
    verifyToken,
    authorizeRoles("faculty", "department", "admin"),
    addAcademicData
);

module.exports = router;