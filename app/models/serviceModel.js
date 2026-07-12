const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    mechanicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    serviceType: {
      type: [String],
      required: true,
      trim: true,
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    description: { type: String },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed","Invoice-generate"],
      default: "Pending",
    },

    beforeImages: { type: [String] },

    afterImages: { type: [String] },

    finalCost: {
      type: Number,
      trim: true,
    },
    repairNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Service", serviceSchema);
