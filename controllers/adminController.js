const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Complaint = require("../models/Complaint");

const createFirstAdmin = async (req, res) => {
    try {
        const adminExists = await User.findOne({ role: "ADMIN" });

        if (adminExists) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists"
            });
        }

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "ADMIN",
            status: "ACTIVE",
            isProtected: true
        });

        res.status(201).json({
            success: true,
            message: "First admin created successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                status: admin.status,
                isProtected: admin.isProtected
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "First admin creation failed"
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const { search, role, status } = req.query;

        const filter = {};

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        if (role) {
            filter.role = role.toUpperCase();
        }

        if (status) {
            filter.status = status.toUpperCase();
        }

        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            filters: {
                search: search || "",
                role: role || "",
                status: status || ""
            },
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get users"
        });
    }
};

const approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role === "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "Admin cannot be approved"
            });
        }

        user.status = "ACTIVE";

        await user.save();

        res.status(200).json({
            success: true,
            message: "User approved successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User approval failed"
        });
    }
};

const rejectUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role === "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "Admin cannot be rejected"
            });
        }

        user.status = "REJECTED";

        await user.save();

        res.status(200).json({
            success: true,
            message: "User rejected successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User rejection failed"
        });
    }
};

const activateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user._id.equals(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "You cannot activate yourself"
            });
        }

        if (user.isProtected) {
            return res.status(403).json({
                success: false,
                message: "Protected admin cannot be modified"
            });
        }

        user.status = "ACTIVE";

        await user.save();

        res.status(200).json({
            success: true,
            message: "User activated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User activation failed"
        });
    }
};

const deactivateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user._id.equals(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "You cannot deactivate yourself"
            });
        }

        if (user.isProtected) {
            return res.status(403).json({
                success: false,
                message: "Protected admin cannot be deactivated"
            });
        }

        user.status = "DEACTIVATED";

        await user.save();

        res.status(200).json({
            success: true,
            message: "User deactivated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User deactivation failed"
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user._id.equals(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "You cannot delete yourself"
            });
        }

        if (user.isProtected) {
            return res.status(403).json({
                success: false,
                message: "Protected admin cannot be deleted"
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User deletion failed"
        });
    }
};

const makeAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user._id.equals(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: "You are already an admin"
            });
        }

        if (user.role === "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "User is already an admin"
            });
        }

        user.role = "ADMIN";
        user.status = "ACTIVE";
        user.isProtected = false;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User is now an admin"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to make user admin"
        });
    }
};

const removeAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user._id.equals(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "You cannot remove your own admin role"
            });
        }

        if (user.isProtected) {
            return res.status(403).json({
                success: false,
                message: "Protected admin cannot be removed"
            });
        }

        if (user.role !== "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "User is not an admin"
            });
        }

        user.role = "USER";

        await user.save();

        res.status(200).json({
            success: true,
            message: "Admin role removed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove admin role"
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({
            role: "USER"
        });

        const pendingUsers = await User.countDocuments({
            role: "USER",
            status: "PENDING"
        });

        const activeUsers = await User.countDocuments({
            role: "USER",
            status: "ACTIVE"
        });

        const deactivatedUsers = await User.countDocuments({
            role: "USER",
            status: "DEACTIVATED"
        });

        const rejectedUsers = await User.countDocuments({
            role: "USER",
            status: "REJECTED"
        });

        const totalAdmins = await User.countDocuments({
            role: "ADMIN"
        });

        const totalComplaints = await Complaint.countDocuments();

        const pendingComplaints = await Complaint.countDocuments({
            status: "PENDING"
        });

        const inProgressComplaints = await Complaint.countDocuments({
            status: "IN PROGRESS"
        });

        const resolvedComplaints = await Complaint.countDocuments({
            status: "RESOLVED"
        });

        const rejectedComplaints = await Complaint.countDocuments({
            status: "REJECTED"
        });

        res.status(200).json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    pending: pendingUsers,
                    active: activeUsers,
                    deactivated: deactivatedUsers,
                    rejected: rejectedUsers
                },
                admins: {
                    total: totalAdmins
                },
                complaints: {
                    total: totalComplaints,
                    pending: pendingComplaints,
                    inProgress: inProgressComplaints,
                    resolved: resolvedComplaints,
                    rejected: rejectedComplaints
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get dashboard statistics"
        });
    }
};

module.exports = {
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
};