//Import required modules
import express from "express";
import employeesController from "../controllers/employeesController.js";

//Router constant
const router = express.Router();

//Create and retrieve routes
router.route("/").get(employeesController.getAllEmployees).post(employeesController.createEmployee);

//Delete and update routes
router.route("/:id").delete(employeesController.removeEmployee).put(employeesController.modifyEmployee);

//Export router
export default router;