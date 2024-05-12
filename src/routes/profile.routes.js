import { Router } from "express";
import { createProfile, updateProfile, deleteProfile, getProfile } from "../controllers/profile.controllers.js";
import verifyUserAccess from "../middlewares/Authentication.middlewares.js";

const router = Router();

// Un-Protected Routes
router.route("/get/:profileId").get(getProfile);

// Protected Routes
router.route("/add").post(verifyUserAccess, createProfile);
router.route("/update/:profileId").put(verifyUserAccess, updateProfile);
router.route("/delete/:profileId").delete(verifyUserAccess, deleteProfile);

export default router;