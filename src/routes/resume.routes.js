import { Router } from "express";
import { uploadResume, getAllResumes, getActiveResume, downloadActiveResume, updateResumeStatus, deleteResume } from "../controllers/resume.controllers.js";
import verifyUserAccess from "../middlewares/Authentication.middlewares.js";
import upload from "../middlewares/Multer.middlewares.js";

const router = Router();

// Un-Protected Routes
router.route("/getActive/:profileId").get(getActiveResume);
router.route("/download/:id").get(downloadActiveResume);

// Protected Routes
router.route("/upload/:profileId").post(verifyUserAccess, upload.single("resume"), uploadResume);
router.route("/getAll/:profileId").get(verifyUserAccess, getAllResumes);
router.route("/update/:id").patch(verifyUserAccess, updateResumeStatus);
router.route("/delete/:id").delete(verifyUserAccess, deleteResume);

export default router;