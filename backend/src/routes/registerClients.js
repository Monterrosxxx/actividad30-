import express from "express";
import registerCliController from "../controllers/registerCliController.js";

const router = express.Router();

router.route("/").post(registerCliController.registerNewClient);
router.route("/validateEmail").post(registerCliController.validateEmailCode);

export default router;