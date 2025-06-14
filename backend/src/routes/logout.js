import express from "express";
import logoutController from "../controllers/logoutController.js";

//Router
const router = express.Router();

//Logout route
router.route("/").post(logoutController.terminateSession);

//Export
export default router;