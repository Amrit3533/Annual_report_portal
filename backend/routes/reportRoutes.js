const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const reportGenerator = require('../controllers/reportGenerator');
const { createReport, fetchReport, getSingleReport} = require("../controllers/reportController");
const { updateReportStatus } = require("../controllers/reportController");

router.post(  
  "/",
  verifyToken,
  authorizeRoles("admin", "department", "faculty"),
  createReport,
);

router.get(
  "/",
  // verifyToken,
  // authorizeRoles("admin", "department", "faculty"),
  fetchReport,
);

router.put(
  "/:id/status",
  verifyToken,
  authorizeRoles("faculty", "department", "admin"),
  updateReportStatus,
);


router.get('/generate/:id', reportGenerator.generateReport);
router.get("/reports/:id", getSingleReport);

module.exports = router;
