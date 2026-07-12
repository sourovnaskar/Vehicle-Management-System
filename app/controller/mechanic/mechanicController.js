const mongoose = require("mongoose");
const Service = require("../../models/serviceModel");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs/promises");
const { sendServiceCompletedMail } = require("../../utils/sendMail");
class Mechanic {
  async renderMechanic(req, res) {
    try {
      const mechanicId = new mongoose.Types.ObjectId(req.user.id);

      const jobs = await Service.aggregate([
        {
          $match: {
            mechanicId: mechanicId,
            status: { $in: ["Pending", "In Progress"] },
          },
        },
        {
          $lookup: {
            from: "vehicles",
            localField: "vehicleId",
            foreignField: "_id",
            as: "vehicleDetails",
          },
        },
        { $unwind: "$vehicleDetails" },
        {
          $lookup: {
            from: "users",
            localField: "customerId",
            foreignField: "_id",
            as: "customerDetails",
          },
        },
        { $unwind: "$customerDetails" },
      ]);

      res.render("mechanicpanel/index", { jobs, user: req.user });
    } catch (error) {
      console.log("Aggregation Error:", error.message);
      res.redirect("/login");
    }
  }

  async getJobCard(req, res) {
    try {
      const jobId = req.params.id;

      const mechanicId = new mongoose.Types.ObjectId(req.user.id);

      const jobData = await Service.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(jobId),
            mechanicId: mechanicId,
          },
        },
        {
          $lookup: {
            from: "vehicles",
            localField: "vehicleId",
            foreignField: "_id",
            as: "vehicleDetails",
          },
        },
        {
          $unwind: {
            path: "$vehicleDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "customerId",
            foreignField: "_id",
            as: "customerDetails",
          },
        },
        {
          $unwind: {
            path: "$customerDetails",
          },
        },
      ]);

      if (!jobData || jobData.length === 0) {
        req.flash("error", "Job card not found or not assigned to you.");
        return res.redirect("/mechanic/dashboard");
      }
      res.render("mechanicpanel/job-card", {
        job: jobData[0],
      });
    } catch (error) {
      console.log("Error loading specific job card:", error.message);
      req.flash("error", "Could not open the workspace.");
      res.redirect("/mechanic/dashboard");
    }
  }

  async updateJobCard(req, res) {
    const jobId = req.params.id;
    const { finalCost, repairNotes } = req.body;
    if (!req.file) {
      req.flash(
        "error",
        "After Service image is Mandatory for updating the job card",
      );
      return res.redirect(`/mechanic/job/${jobId}`);
    }
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "VSMS-Images",
      });
      await fs.unlink(req.file.path);
      let updatedJob = {
        status: "Completed",
        finalCost: finalCost,
        repairNotes: repairNotes,
        afterImages: [result.secure_url],
      };

      await Service.findByIdAndUpdate(jobId, updatedJob);

      const jobDetails = await Service.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(jobId) },
        },
        {
          $lookup: {
            from: "users",
            localField: "customerId",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: { path: "$customer", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: "vehicles", // Double-check this collection name in your DB
            localField: "vehicleId",
            foreignField: "_id",
            as: "vehicleData",
          },
        },
        {
          $unwind: { path: "$vehicleData", preserveNullAndEmptyArrays: true },
        },
      ]);

      if (
        jobDetails.length > 0 &&
        jobDetails[0].customer &&
        jobDetails[0].vehicleData
      ) {
        const user = jobDetails[0].customer;
        const vehicle = jobDetails[0].vehicleData;

        await sendServiceCompletedMail(user, vehicle, updatedJob);
      }

      req.flash("success", "Job marked as completed!");
      res.redirect("/mechanic/dashboard");
    } catch (error) {
      console.error(error);
      req.flash("error", "Some error Occur during updated the job-card");
      return res.redirect(`/mechanic/job/${jobId}`);
    }
  }

  async serviceHistory(req, res) {
    try {
      const mechanicId = new mongoose.Types.ObjectId(req.user.id);
      const previousJobs = await Service.aggregate([
        {
          $match: {
            mechanicId: mechanicId,
            status: "Completed",
          },
        },

        {
          $lookup: {
            from: "vehicles",
            localField: "vehicleId",
            foreignField: "_id",
            as: "vehiclesDetail",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "customerId",
            foreignField: "_id",
            as: "customerDetail",
          },
        },
        {
          $unwind: {
            path: "$customerDetail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$vehiclesDetail",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      res.render("mechanicpanel/serviceHistory", { jobs: previousJobs });
    } catch (error) {
      console.log("Aggregation Error:", error.message);
      res.redirect("/login");
    }
  }
}

module.exports = new Mechanic();
