//Import app configuration
import app from "./app.js";
import "./database.js";
import {config} from "./src/config.js";

//Start server
async function initializeServer() {
    app.listen(config.server.PORT);
    console.log("Server running on Port: " + config.server.PORT);
}   

//Execute server
initializeServer();