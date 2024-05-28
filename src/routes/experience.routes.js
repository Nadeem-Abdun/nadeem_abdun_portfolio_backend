import { Router } from "express";
import { createExperience, updateExperience, deleteExperience, getExperience } from "../controllers/experience.controllers.js";
import verifyUserAccess from "../middlewares/Authentication.middlewares.js";

const router = Router();

// Un-Protected Routes
router.route("/get/:id").get(getExperience);

// Protected Routes
router.route("/create/:profileId").post(verifyUserAccess, createExperience);
router.route("/update/:id").put(verifyUserAccess, updateExperience);
router.route("/delete/:id").delete(verifyUserAccess, deleteExperience);

export default router;