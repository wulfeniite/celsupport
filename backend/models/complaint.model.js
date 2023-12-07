const mongoose = require("mongoose");

const complaintSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: false,
    },
    issueNo: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      default: "pending",
    },
    feedback: {
      type: String,
      required: false,
    },
    resolvedAt: {
      type: Date,
      required: false,
    },
  },
  {
    collection: "complaint-data",
  }
);

module.exports = mongoose.model("ComplaintData", complaintSchema);
