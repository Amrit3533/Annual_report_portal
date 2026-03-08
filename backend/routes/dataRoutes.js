const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const { insertData } = require("../controllers/dataController");

router.post(
    "/:table",
    verifyToken,
    authorizeRoles("faculty","department","admin"),
    insertData
);

module.exports = router;