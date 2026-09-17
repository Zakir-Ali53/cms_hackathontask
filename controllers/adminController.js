const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Complaint = require("../models/Complaint");

const createFirstAdmin = async (req, res) => {
    try {
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

        const existingProtectedAdmin = await User.findOne({
            role: "ADMIN",
            isProtected: true
        });

        if (existingProtectedAdmin) {
            return res.status(403).json({
                success: false,
                message: "First admin already exists"
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
            user: {
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
            message: "Failed to create first admin",
            error: error.message
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
            message: "User approved successfully",
            user
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

        if (user.isProtected) {
            return res.status(403).json({
                success: false,
                message: "Protected admin cannot be modified"
            });
        }

        user.status = "REJECTED";

        await user.save();

        res.status(200).json({
            success: true,
            message: "User rejected successfully",
            user
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
            message: "User activated successfully",
            user
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

        if (user.isProtected) {
            return res.status(403).json({
                success: false,
                message: "Protected admin cannot be modified"
            });
        }

        user.status = "DEACTIVATED";

        await user.save();

        res.status(200).json({
            success: true,
            message: "User deactivated successfully",
            user
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

        if (user.isProtected) {
            return res.status(403).json({
                success: false,
                message: "Protected admin cannot be deleted"
            });
        }

        await Complaint.deleteMany({
            user: user._id
        });

        await User.findByIdAndDelete(user._id);

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

        if (user.isProtected) {
            return res.status(403).json({
                success: false,
                message: "User is already protected"
            });
        }

        user.role = "ADMIN";
        user.status = "ACTIVE";
        user.isProtected = false;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User is now an admin",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to make admin"
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
            message: "Admin role removed successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove admin"
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            pendingUsers,
            activeUsers,
            totalComplaints,
            pendingComplaints,
            resolvedComplaints
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ status: "PENDING" }),
            User.countDocuments({ status: "ACTIVE" }),
            Complaint.countDocuments(),
            Complaint.countDocuments({ status: "PENDING" }),
            Complaint.countDocuments({ status: "RESOLVED" })
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                pendingUsers,
                activeUsers,
                totalComplaints,
                pendingComplaints,
                resolvedComplaints
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