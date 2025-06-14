import express from "express";
import multer from "multer";
import moviesController from "../controllers/moviesController.js";

//Router
const router = express.Router();

//Configure upload directory
const fileUpload = multer({dest: "public/"})

//Movie routes
router.route("/")
    .get(moviesController.getAllMovies)
    .post(fileUpload.single("image"), moviesController.createMovie);

router.route("/:id")
    .delete(moviesController.removeMovie)
    .put(moviesController.modifyMovie);

//Export
export default router;