import { Router } from "express";
import { createProfile, updateProfile, deleteProfile, getProfile } from "../controllers/profile.controllers.js";
import verifyUserAccess from "../middlewares/Authentication.middlewares.js";
import upload from "../middlewares/Multer.middlewares.js";

const router = Router();

// Un-Protected Routes
router.route("/get/:profileId").get(getProfile);

// Protected Routes
router.route("/create").post(verifyUserAccess, upload.single("profilePicture"), createProfile);
router.route("/update/:profileId").put(verifyUserAccess, upload.single("profilePicture"), updateProfile);
router.route("/delete/:profileId").delete(verifyUserAccess, deleteProfile);

export default router;