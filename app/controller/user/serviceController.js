const Service = require("../../models/serviceModel");

const User = require("../../models/userModel");
const mongoose = require("mongoose");
class ServiceController {
    
  async renderbookService(req, res) {
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
      res.render("bookService", {
        user: userData,
      });
    } catch (error) {
      console.error("dashboard error :", error);
    }
  }

  async bookService(req, res) {
    try {
      const { vehicleId, serviceType, preferredDate, problemDescription } =
        req.body;
      if (!vehicleId || !serviceType || !preferredDate || !problemDescription) {
        req.flash("error", "All fields are required");
        return res.redirect("/service/booking-view");
      }
      const isBooked = await Service.findOne({ vehicleId });
      if (isBooked) {
        req.flash("error", "This vehicle already Booked for servicing");
        return res.redirect("/service/booking-view");
      }

      const bookingService = new Service({
        customerId: req.user.id,
        vehicleId,
        serviceType,
        preferredDate,
        description: problemDescription,
      });
      await bookingService.save();
      req.flash("success", "Service booked Successfully");
      return res.redirect("/vehicle/dashboard");
    } catch (error) {
      console.error("Booking Error:", error);
      req.flash("error", "Something went wrong while booking.");
      return res.redirect("/service/booking-view");
    }
  }
}

module.exports = new ServiceController();
