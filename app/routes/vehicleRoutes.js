const express = require("express");
const vehicleController = require("../controller/vehicleController");
const authCheck = require("../middleware/authCheck");

const routes = express.Router();

routes.get('/addcar',authCheck,vehicleController.addCar)
routes.post('/create',authCheck, vehicleController.create)

routes.get("/dashboard", authCheck, vehicleController.renderDashboard);
routes.get('/track-progress', authCheck, vehicleController.trackProgress);

routes.get("/edit-car/:id",  vehicleController.renderedit);
routes.post("/update-car/:id",  vehicleController.updatecar);
routes.post("/delete/:id", authCheck, vehicleController.deleteCar);

module.exports = routes;