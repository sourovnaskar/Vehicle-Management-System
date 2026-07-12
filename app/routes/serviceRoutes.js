const express = require("express");
const serviceController = require("../controller/user/serviceController");
const authCheck = require("../middleware/authCheck");

const routes = express.Router();

routes.get('/booking-view',authCheck, serviceController.renderbookService)
routes.post('/book',authCheck, serviceController.bookService)

module.exports = routes;