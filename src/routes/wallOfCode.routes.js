import { Router } from "express";
import { createSkill, updateSkill, deleteSkill, getSkills } from "../controllers/wallOfCode.controllers.js"
import verifyUserAccess from "../middlewares/Authentication.middlewares.js";

const router = Router();

// Un-Protected Routes
router.route("/getSkills/:profileId").get(getSkills)

// Protected Routes
router.route("create/:profileId").post(verifyUserAccess, createSkill);
router.route("update/:id").put(verifyUserAccess, updateSkill);
router.route("delete/:id").delete(verifyUserAccess, deleteSkill);

export default router;