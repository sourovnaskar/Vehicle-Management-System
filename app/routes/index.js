const express = require("express");

const routes = express.Router();

const userController=require('./userRoutes')
routes.use(userController)

module.exports=routes