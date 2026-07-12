const Vehicle = require("../models/vehicleModel");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Service = require("../models/serviceModel");
class VehicleController {
  addCar(req, res) {
    res.render("addCar");
  }

  async create(req, res) {
    try {
      const { vehicleNumber, brand, model, year } = req.body;

      if (!vehicleNumber || !brand || !model || !year) {
        return req.flash("error", "All fields are required");
      }

      const vehicle = new Vehicle({
        ownerId: req.user.id,
        vehicleNumber,
        brand,
        model,
        year,
      });
      await vehicle.save();
      return res.redirect("/vehicle/dashboard");
    } catch (error) {
      console.error(error.message);
      req.flash("error", "Failed to save vehicle : " + error.message);
      return res.redirect("/vehicle/dashboard");
    }
  }

  async renderDashboard(req, res) {
    try {
      const userid = req.user.id;
      const userWithVehicles = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(userid),
          },
        },
        {
          $lookup: {
            from: "vehicles",
            localField: "_id",
            foreignField: "ownerId",
            as: "myCars",
          },
        },
      ]);

      const userData = userWithVehicles[0];
      res.render("dashboard", {
        user: userData,
      });
    } catch (error) {
      console.error("dashboard error :", error);
    }
  }

  async trackProgress(req, res) {
    try {
      const customerId = new mongoose.Types.ObjectId(req.user.id);

      const activeServices = await Service.aggregate([
        {
          $match: { customerId: customerId },
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
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);

      res.render("track-progress", {
        user: req.user,
        activeServices: activeServices,
      });
    } catch (error) {
      console.log("Error loading track progress:", error.message);

      res.redirect("/login");
    }
  }

  async renderedit(req, res) {
    const id = req.params.id;
    const findVehicle = await Vehicle.findById(id);
    res.render("editCar", {
      data: findVehicle,
    });
  }

  async updatecar(req, res) {
    try {
      const id = req.params.id;
      const updated = await Vehicle.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.redirect("/vehicle/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  async deleteCar(req, res) {
    try {
      const vehicleId = req.params.id;
      const userId = req.user.id;
      const deletedVehicle = await Vehicle.findOneAndDelete({
        ownerId: userId,
        _id: vehicleId,
      });
      if (!deletedVehicle) {
        req.flash("error", "Vehicle not found or unauthorized action.");
        return res.redirect("/vehicle/dashboard");
      }
      req.flash("success", "Vehicle successfully removed from your garage.");
      return res.redirect("/vehicle/dashboard");
    } catch (error) {
      console.error(error);
      return res.redirect("/vehicle/dashboard");
    }
  }
}

module.exports = new VehicleController();
