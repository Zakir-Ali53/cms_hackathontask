const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            enum: [
                "ACADEMIC",
                "ADMINISTRATION",
                "FACILITY",
                "STAFF",
                "FEES",
                "OTHER"
            ],
            default: "OTHER"
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "IN PROGRESS",
                "RESOLVED",
                "REJECTED"
            ],
            default: "PENDING"
        },

        adminResponse: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Complaint", complaintSchema);