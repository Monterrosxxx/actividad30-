/*
    Campos:
        title
        description
        director
        genre
        year
        duration
        image
*/

//Importar Mongoose
import {Schema, model} from "mongoose";

//Schema
const moviesSchema = new Schema({
    title: {
        type: String,
        require: true
    },

    description: {
        type: String,
        maxLength: 255,
        require: true
    },

    director: {
        type: String,
        require: true
    },

    genre: {
        type: String,
        require: true
    },
    
    year: {
        type: Number,
        require: true
    },

    duration: {
        type: Number,
        require: true
    },

    image: {
        type: String,
        require: true
    }
    
}, {
    timestamps: true,
    strict: false
});

export default model("Movies", moviesSchema);