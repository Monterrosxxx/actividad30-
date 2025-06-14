//Imports
import express from "express";
import passRecoveryController from "../controllers/passRecoveryController.js";

//Router
const router = express.Router();

//Recovery routes
router.route("/sendCode").post(passRecoveryController.sendRecoveryCode);
router.route("/validateCode").post(passRecoveryController.validateRecoveryCode);
router.route("/updatePassword").post(passRecoveryController.updatePassword);

//Export
export default router;