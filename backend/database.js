//Mongoose
import mongoose from "mongoose";

import {config} from "./src/config.js";

//MongoDB Connection
mongoose.connect(config.database.URI);

//Database Connection Validation
const dbConnection = mongoose.connection;

dbConnection.once("open", () => {
    console.log("Database Connection Established Successfully");
});

dbConnection.on("disconnected", () => {
    console.log("Database Connection Lost");
});

dbConnection.on("error", (error) => {
    console.log("Database Connection Error: " + error);
});