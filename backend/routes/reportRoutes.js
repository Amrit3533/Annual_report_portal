const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const reportController = require("../controllers/reportController");
const reportGenerator = require("../controllers/reportGenerator");

router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "department", "faculty"),
  reportController.createReport,
);

router.get("/", reportController.fetchReport);

router.put(
  "/:id/status",
  verifyToken,
  authorizeRoles("faculty", "department", "admin"),
  reportController.updateReportStatus,
);

router.get("/generate/:id", reportGenerator.generateReport);

router.get("/reports/:id", reportController.getSingleReport);

module.exports = router;
