import {Router} from "express";
import healthCheck from "../controllers/healthCheck.controllers.js";

const router = Router();

// Un-Protected Routes
router.route("/status").get(healthCheck);

export default router;