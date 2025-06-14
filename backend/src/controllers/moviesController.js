const moviesController = {};
import moviesSchema from "../models/Movies.js";
import {v2 as cloudinary} from "cloudinary";
import {config} from "../config.js";

//Cloudinary Configuration
cloudinary.config({
    cloud_name: config.cloudinaryConfig.cloudName,
    api_key: config.cloudinaryConfig.apiKey,
    api_secret: config.cloudinaryConfig.apiSecret,
});

//Get all movies
moviesController.getAllMovies = async(req, res) => {
    try {
        const moviesList = await moviesSchema.find();
        return res.status(200).json(moviesList);
    } catch (error) {
        return res.status(500).json({message: "Error retrieving movies catalog", error: error.message});
    }
};

//Create new movie
moviesController.createMovie = async(req, res) => {
    const {title, description, director, genre, year, duration, image} = req.body;
    
    try {
        let imageURL = ""
        if (req.file){
            const uploadResult = await cloudinary.uploader.upload(
                req.file.path, 
                {
                    folder: "public",
                    allowed_formats: ["jpg", "png", "jpeg"]
                }
            );
            imageURL = uploadResult.secure_url
        };

        const movieData = new moviesSchema({
            title, 
            description, 
            director, 
            genre, 
            year, 
            duration, 
            image: imageURL
        });

        await movieData.save();
        return res.status(201).json({message: "Movie successfully added to catalog"});
    }
    catch (error) {
        console.log("Movie creation error: " + error);
        return res.status(500).json({message: "Failed to create movie entry", error: error.message});
    }
};

//Remove movie
moviesController.removeMovie = async(req, res) => {
    try {
        await moviesSchema.findByIdAndDelete(req.params.id);
        return res.status(200).json({message: "Movie successfully deleted from catalog"});
    } catch (error) {
        return res.status(500).json({message: "Error removing movie", error: error.message});
    }
};

//Modify movie
moviesController.modifyMovie = async(req, res) => {
    try {
        const {title, description, director, genre, year, duration, image} = req.body;
        const updatedMovie = await moviesSchema.findByIdAndUpdate(req.params.id, {title, description, director, genre, year, duration, image}, {new: true});
        if (!updatedMovie) {
            return res.status(404).json({message: "Movie not found in catalog"});
        }
        return res.status(200).json({message: "Movie information updated successfully"});
    } catch (error) {
        return res.status(500).json({message: "Error updating movie data", error: error.message});
    }
};

//Export
export default moviesController;