import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, updatePassword, getLoggedInUser, updateAccountDetails, getPortfolioProfile } from "../controllers/user.controllers.js";
import verifyUserAccess from "../middlewares/Authentication.middlewares.js";
import { authRateLimiter } from "../middlewares/RateLimiter.middlewares.js";
import { validateRegistration, validateLogin } from "../middlewares/Validation.middlewares.js";

const router = Router();

// Un-Protected Routes
router.route("/register").post(authRateLimiter, validateRegistration, registerUser);
router.route("/login").post(authRateLimiter, validateLogin, loginUser);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/get-profile/:username").get(getPortfolioProfile);

// Protected Routes
router.route("/logout").get(verifyUserAccess, logoutUser);
router.route("/update-password").post(verifyUserAccess, updatePassword);
router.route("/get-user").get(verifyUserAccess, getLoggedInUser);
router.route("/update-account").patch(verifyUserAccess, updateAccountDetails);

export default router;