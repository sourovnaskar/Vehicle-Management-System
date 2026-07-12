const express = require("express");
const mechanicController = require("../../controller/mechanic/mechanicController");
const routes = express.Router();
const authCheck = require("../../middleware/authCheck");
const image = require("../../utils/multerSetup");
routes.get("/dashboard", authCheck, mechanicController.renderMechanic);
routes.get("/job/:id", authCheck, mechanicController.getJobCard);
routes.post(
  "/update-Job/:id",
  authCheck,
  image.single("image"),
  mechanicController.updateJobCard,
);
routes.get("/service-history", authCheck, mechanicController.serviceHistory);

module.exports = routes;
