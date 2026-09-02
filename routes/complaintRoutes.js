const express = require("express");

const {
    createComplaint,
    getMyComplaints,
    getMyComplaint,
    getAllComplaints,
    updateComplaint
} = require("../controllers/complaintController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createComplaint);

router.get("/my", protect, getMyComplaints);

router.get("/my/:id", protect, getMyComplaint);

router.get("/all", protect, adminOnly, getAllComplaints);

router.put("/:id", protect, adminOnly, updateComplaint);

module.exports = router;