import { Router } from "express";
import { createProject, updateProject, deleteProject, getProject, getAllProjects } from "../controllers/project.controllers.js";
import verifyUserAccess from "../middlewares/Authentication.middlewares.js";
import upload from "../middlewares/Multer.middlewares.js";

const router = Router();

// Un-Protected Routes
router.route("/get/:id").get(getProject);

// Protected Routes
router.route("/create/:profileId").post(verifyUserAccess, upload.single("projectPicture"), createProject);
router.route("/getAll/:profileId").get(verifyUserAccess, getAllProjects);
router.route("/update/:id").put(verifyUserAccess, upload.single("projectPicture"), updateProject);
router.route("/delete/:id").delete(verifyUserAccess, deleteProject);

export default router;