const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const dashboard = require('../controllers/dashboardController');

router.get('/stats', dashboard.getDashboardStats);
router.get('/department-stats', dashboard.departmentStats);
router.get('/research-trend', dashboard.researchTrend);
router.get('/achievement-distribution', dashboard.achievementDistribution);
// ADMIN Dashboard
router.get(
    '/admin/dashboard',
    verifyToken,
    authorizeRoles('admin'),
    (req, res) => {
        res.json({
            message: "Admin Dashboard Access Granted",
            user: req.user
        });
    }
);

// ADMIN can create users
router.post(
    '/admin/create-user',
    verifyToken,
    authorizeRoles('admin'),
    (req, res) => {
        res.json({ message: "Admin can create users here" });
    }
);

// Faculty can submit data
router.post(
    '/faculty/submit-data',
    verifyToken,
    authorizeRoles('faculty'),
    (req, res) => {
        res.json({
            message: "Faculty data submission allowed",
            facultyId: req.user.id
        });
    }
);

// Faculty can edit own data
router.put(
    '/faculty/edit-data',
    verifyToken,
    authorizeRoles('faculty'),
    (req, res) => {
        res.json({
            message: "Faculty can edit own data"
        });
    }
);

// Department can approve submissions
router.post(
    '/department/approve',
    verifyToken,
    authorizeRoles('department'),
    (req, res) => {
        res.json({
            message: "Department approval allowed"
        });
    }
);

// Department can view all faculty submissions
router.get(
    '/department/view-submissions',
    verifyToken,
    authorizeRoles('department'),
    (req, res) => {
        res.json({
            message: "Department can view submissions"
        });
    }
);

// Student can view reports
router.get(
    '/student/view-report',
    verifyToken,
    authorizeRoles('student'),
    (req, res) => {
        res.json({
            message: "Student view-only access granted"
        });
    }
);

module.exports = router;