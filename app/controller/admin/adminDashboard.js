const Service = require("../../models/serviceModel");
const User = require("../../models/userModel");
const Invoice = require("../../models/invoiceModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const {
  sendOtpMail,
  sendMechanicAssignedMail,
  sendMechanicWelcomeMail,
  sendInvoiceMail,
} = require("../../utils/sendMail");
class Admindashboard {
  async renderDashboard(req, res) {
    try {
      const totalUsers = await User.countDocuments({ role: "Customer" });
      const totalMechanics = await User.countDocuments({ role: "Mechanic" });
      const readyForPickup = await Service.countDocuments({
        status: "Completed",
      });

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const todayRevenueResult = await Service.aggregate([
        {
          $match: {
            status: "Completed",
            updatedAt: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$finalCost" },
          },
        },
      ]);

      const todayRevenue =
        todayRevenueResult.length > 0 ? todayRevenueResult[0].totalAmount : 0;

      const totalRevenueResult = await Service.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: null, totalAmount: { $sum: "$finalCost" } } },
      ]);
      const totalRevenue =
        totalRevenueResult.length > 0 ? totalRevenueResult[0].totalAmount : 0;

      res.render("adminpanel/index", {
        totalUsers,
        totalMechanics,
        readyForPickup,
        todayRevenue,
        totalRevenue,
        user: req.user,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async renderCustomer(req, res) {
    try {
      const customerFind = await User.aggregate([
        {
          $match: {
            role: "Customer",
          },
        },
        {
          $lookup: {
            from: "vehicles",
            localField: "_id",
            foreignField: "ownerId",
            as: "vehicles",
          },
        },
      ]);
      res.render("adminpanel/customerpage", { customerFind });
    } catch (error) {
      console.error(error);
    }
  }

  async toggleUserStatus(req, res) {
    try {
      const id = req.params.id;
      const status = await User.findById(id);
      const changeStatus =
        status.isActive === true
          ? (status.isActive = false)
          : (status.isActive = true);
      await status.save();
      req.flash("success", `User Successfully ${changeStatus}`);
      return res.redirect("/admin/admindashboard");
    } catch (error) {
      req.flash("success", `User Successfully ${changeStatus}`);
      return console.error(error.message);
    }
  }

  async renderMechanic(req, res) {
    try {
      const mechanicFind = await User.find({ role: "Mechanic" });
      res.render("adminpanel/mechanicpage", {
        pageTitle: "Mechanic Management - VSMS",
        mechanicFind,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async renderAddMechanic(req, res) {
    try {
      res.render("adminpanel/addMechanic");
    } catch (error) {
      console.error(error);
    }
  }

  async addMechanic(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        req.flash("error", "All fields are Required");
        return res.redirect("/rendermechanics");
      }
      const existingMechanic = await User.findOne({ email });
      if (existingMechanic) {
        req.flash("error", "Mechanic Already Exist");
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const mechanic = new User({
        name,
        email,
        password: hashPassword,
        role: "Mechanic",
      });
      await mechanic.save();

      await sendMechanicWelcomeMail(mechanic, password);
      return res.redirect("/admin/mechanics");
    } catch (error) {
      console.error(error);
    }
  }

  async renderServiceVheicle(req, res) {
    try {
      const serviceVehicle = await Service.aggregate([
        {
          $match: {
            status: { $in: ["Pending", "In Progress"] },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "customerId",
            foreignField: "_id",
            as: "details-customer",
          },
        },
        {
          $unwind: "$details-customer",
        },
        {
          $lookup: {
            from: "vehicles",
            localField: "vehicleId",
            foreignField: "_id",
            as: "details-vehicle",
          },
        },
        {
          $unwind: "$details-vehicle",
        },
        {
          $project: {
            _id: 1,
            serviceType: 1,
            preferredDate: 1,
            description: 1,
            status: 1,
            "details-customer.name": 1,
            "details-vehicle.brand": 1,
            "details-vehicle.model": 1,
            "details-vehicle.vehicleNumber": 1,
          },
        },
      ]);

      res.render("adminpanel/activejobs", { serviceVehicle });
    } catch (error) {
      console.error("Error fetching active jobs:", error);
    }
  }

  async assignMechanic(req, res) {
    try {
      const jobId = req.params.id;

      const activeJobs = await Service.find({
        status: { $in: ["In Progress"] },
        mechanicId: { $exists: true },
      }).select("mechanicId");

      const busyMechanicId = activeJobs.map((job) => job.mechanicId);

      const freeMechanic = await User.findOne({
        role: "Mechanic",
        _id: { $nin: busyMechanicId },
      });

      if (!freeMechanic) {
        req.flash("error", "All Mechanics Are busy");
        return res.redirect("/admin/job-cards");
      }

      await Service.findByIdAndUpdate(
        jobId,
        {
          status: "In Progress",
          mechanicId: freeMechanic._id,
        },
        { new: true },
      );

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
            from: "vehicles",
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

        await sendMechanicAssignedMail(user, vehicle);
      }

      req.flash("success", "Mechanic successfully assigned to the job.");
      res.redirect("/admin/job-cards");
    } catch (error) {
      console.error("Error assigning mechanic:", error);
      req.flash("error", "An internal error occurred.");
      res.redirect("/admin/job-cards");
    }
  }

  async serviceHistory(req, res) {
    try {
      const history = await Service.aggregate([
        {
          $match: {
            status: { $in: ["Completed", "Invoice-generate"] },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "customerId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "mechanicId",
            foreignField: "_id",
            as: "mechanicDetails",
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
        { $unwind: "$userDetails" },
        { $unwind: "$mechanicDetails" },
        { $unwind: "$vehicleDetails" },
        {
          $project: {
            serviceType: 1,
            description: 1,
            status: 1,
            afterImages: 1,
            finalCost: 1,
            repairNotes: 1,
            "userDetails.name": 1,
            "mechanicDetails.name": 1,
            "vehicleDetails.vehicleNumber": 1,
            "vehicleDetails.brand": 1,
            "vehicleDetails.model": 1,
          },
        },
      ]);
      return res.render("adminpanel/serviceHistory", { history ,user: req.user});
    } catch (error) {
      console.error(error);
    }
  }

// Add this to your adminController
async renderBillingQueue(req, res) {
    try {
        // Find all services that are "Completed" (ready for invoice)
        // Populate customer and vehicle so we can show their details in the table
        const readyServices = await Service.find({ status: "Completed" })
            .populate("customerId")
            .populate("vehicleId")
            .sort({ updatedAt: -1 }); // Show newest first

        res.render("adminpanel/billing-queue", {
            services: readyServices,
            user: req.user
        });
    } catch (error) {
        console.error("Error loading billing queue:", error);
        req.flash("error", "Failed to load billing queue.");
        res.redirect("/admin/dashboard");
    }
}

  async generateInvoice(req, res) {
    try {
      const serviceId = req.params.id;

      const service = await Service.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(serviceId) },
        },
        {
          $lookup: {
            from: "vehicles",
            localField: "vehicleId",
            foreignField: "_id",
            as: "vehicleData",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "customerId",
            foreignField: "_id",
            as: "customerData",
          },
        },
        { $unwind: "$vehicleData" },
        { $unwind: "$customerData" },
      ]);
      const serviceData = service[0];
      if (serviceData.status !== "Completed") {
        req.flash("error", "Job must be completed before billing.");
        return res.redirect("/admin/billing-queue");
      }
      const taxRate = 0.18;
      const calculatedTax = serviceData.finalCost * taxRate;
      const finalGrandTotal = serviceData.finalCost + calculatedTax;

      const newInvoice = new Invoice({
        serviceId: serviceData._id,
        tax: calculatedTax,
        totalAmount: finalGrandTotal,
      });
      await newInvoice.save();

      await Service.findByIdAndUpdate(serviceId, {
        status: "Invoice-generate",
      });
      if (serviceData.customerData && serviceData.vehicleData) {
        await sendInvoiceMail(
          serviceData.customerData,
          serviceData.vehicleData,
          serviceData,
          newInvoice,
        );
      }
      req.flash("success", "Invoice generated and emailed to the customer!");
      res.redirect("/admin/billing");
    } catch (error) {console.error("CRITICAL INVOICE ERROR: ", error); 

      // 2. This stops the browser from spinning forever
      req.flash("error", "Something went wrong while generating the invoice.");
      return res.redirect("/admin/billing");}
  }
}

module.exports = new Admindashboard();
