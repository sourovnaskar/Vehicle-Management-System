const express = require("express");
const userController = require("../controller/userController");
const validate = require("../middleware/validation");
const { registerSchema, loginSchema } = require("../utils/schemaValidation");

const routes = express.Router();

routes.get("/register", userController.registerView);
routes.post(
  "/register-create",
  validate(registerSchema),
  userController.register,
);

routes.get("/login", userController.loginview);
routes.post("/login-create", validate(loginSchema), userController.login);

module.exports = routes;
