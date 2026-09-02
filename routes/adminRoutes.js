const express = require("express");

const {
    createFirstAdmin,
    getUsers,
    approveUser,
    rejectUser,
    activateUser,
    deactivateUser,
    deleteUser,
    makeAdmin,
    removeAdmin,
    getDashboardStats
} = require("../controllers/adminController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-first-admin", createFirstAdmin);

router.get("/dashboard", protect, adminOnly, getDashboardStats);

router.get("/users", protect, adminOnly, getUsers);

router.put("/approve/:id", protect, adminOnly, approveUser);

router.put("/reject/:id", protect, adminOnly, rejectUser);

router.put("/activate/:id", protect, adminOnly, activateUser);

router.put("/deactivate/:id", protect, adminOnly, deactivateUser);

router.delete("/users/:id", protect, adminOnly, deleteUser);

router.put("/make-admin/:id", protect, adminOnly, makeAdmin);

router.put("/remove-admin/:id", protect, adminOnly, removeAdmin);

module.exports = router;