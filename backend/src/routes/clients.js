//Import required modules
import express from "express";
import clientsController from "../controllers/clientsController.js";

//Router constant
const router = express.Router();

//Create and retrieve routes
router.route("/").get(clientsController.getAllClients).post(clientsController.createClient);

//Delete and update routes
router.route("/:id").delete(clientsController.removeClient).put(clientsController.modifyClient);

//Export router
export default router;