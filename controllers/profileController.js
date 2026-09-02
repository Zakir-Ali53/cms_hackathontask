const User = require("../models/User");

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get profile"
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const existingUser = await User.findOne({
            email,
            _id: { $ne: req.user._id }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                name,
                email
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Profile update failed"
        });
    }
};

module.exports = {
    getProfile,
    updateProfile
};