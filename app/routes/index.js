const express = require("express");

const routes = express.Router();

const userRoutes = require("./userRoutes");
routes.use(userRoutes);

const vehicleRoutes = require("./vehicleRoutes");
routes.use("/vehicle", vehicleRoutes);

const serviceRoutes = require("./serviceRoutes");
routes.use("/service", serviceRoutes);

const adminDashboardRoutes = require("./admin/adminDashboardRoutes");
routes.use("/admin", adminDashboardRoutes);

const mechanicRoutes = require("./mechanic/mechanicRoutes");
routes.use("/mechanic", mechanicRoutes);

module.exports = routes;
