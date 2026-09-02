const Complaint = require("../models/Complaint");

const createComplaint = async (req, res) => {
    try {
        const { title, description, category } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required"
            });
        }

        const complaint = await Complaint.create({
            user: req.user._id,
            title,
            description,
            category: category || "OTHER",
            status: "PENDING"
        });

        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            complaint
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Complaint submission failed"
        });
    }
};

const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get complaints"
        });
    }
};

const getMyComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            success: true,
            complaint
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get complaint"
        });
    }
};

const getAllComplaints = async (req, res) => {
    try {
        const { search, status, category } = req.query;

        const filter = {};

        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        if (status) {
            filter.status = status.toUpperCase();
        }

        if (category) {
            filter.category = category.toUpperCase();
        }

        const complaints = await Complaint.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            filters: {
                search: search || "",
                status: status || "",
                category: category || ""
            },
            complaints
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get complaints"
        });
    }
};

const updateComplaint = async (req, res) => {
    try {
        const { status, adminResponse } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        if (status) {
            complaint.status = status;
        }

        if (adminResponse !== undefined) {
            complaint.adminResponse = adminResponse;
        }

        await complaint.save();

        res.status(200).json({
            success: true,
            message: "Complaint updated successfully",
            complaint
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Complaint update failed"
        });
    }
};

module.exports = {
    createComplaint,
    getMyComplaints,
    getMyComplaint,
    getAllComplaints,
    updateComplaint
};