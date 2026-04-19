import { Router } from "express";
import { createContactForm, getContactForms, replyContactForm, deleteContactForm } from "../controllers/contactMe.controllers.js";
import verifyUserAccess from "../middlewares/Authentication.middlewares.js";
import { contactFormRateLimiter } from "../middlewares/RateLimiter.middlewares.js";
import { validateContactForm } from "../middlewares/Validation.middlewares.js";

const router = Router();

// Un-Protected Routes
router.route("/create/:profileId").post(contactFormRateLimiter, validateContactForm, createContactForm);

// Protected Routes
router.route("/getForms/:profileId").get(verifyUserAccess, getContactForms);
router.route("/reply/:id").patch(verifyUserAccess, replyContactForm);
router.route("/delete/:id").delete(verifyUserAccess, deleteContactForm);

export default router;