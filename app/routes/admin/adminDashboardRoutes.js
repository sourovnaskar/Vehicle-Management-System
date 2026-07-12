const express = require("express");
const adminDashboard = require("../../controller/admin/adminDashboard");
const authCheck = require("../../middleware/authCheck");

const routes = express.Router();

routes.get("/dashboard", authCheck, adminDashboard.renderDashboard);
routes.get("/admindashboard", adminDashboard.renderCustomer);
routes.post("/customer/:id/toggle-status", adminDashboard.toggleUserStatus);
routes.get("/mechanics", adminDashboard.renderMechanic);
routes.get("/rendermechanics", adminDashboard.renderAddMechanic);
routes.post("/add-mechanics", adminDashboard.addMechanic);
routes.get("/job-cards", adminDashboard.renderServiceVheicle);
routes.get("/service/:id/assign", adminDashboard.assignMechanic);
routes.get("/job-history", adminDashboard.serviceHistory);

routes.get("/billing", authCheck,adminDashboard.renderBillingQueue);
routes.post("/generate-invoice/:id", adminDashboard.generateInvoice);
module.exports = routes;
