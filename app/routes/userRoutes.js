const express = require("express");
const userController = require("../controller/userController");
const validate = require("../middleware/validation");
const { registerSchema, loginSchema } = require("../utils/schemaValidation");
const authCheck = require("../middleware/authCheck");

const routes = express.Router();

routes.get("/", userController.landingView);

routes.get("/register", userController.registerView);

/**
 * @swagger
 * /register-create:
 *   post:
 *     summary: Register User
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: body
 *        name: Add User
 *        description: Add User in MongoDB.
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - email
 *            - role
 *          properties:
 *            name:
 *              type: string
 *            email:
 *              type: string
 *            role:
 *              type: string
 *     responses:
 *        201:
 *          description: User data Registered
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
 */

routes.post(
  "/register-create",
  validate(registerSchema),
  userController.register,
);
routes.get("/otp", userController.otpView);
routes.post("/verify-otp", userController.verifyOtp);


routes.get("/request-verification", userController.requestVerificationView);

routes.post("/send-new-otp", userController.sendNewOtp);

routes.get("/login", userController.loginview);
routes.post("/login-create", validate(loginSchema), userController.login);

routes.get("/logout", authCheck, userController.logout);
module.exports = routes;
