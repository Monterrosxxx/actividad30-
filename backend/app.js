//Imports
import express, { application } from "express";
import cookieParser from "cookie-parser";

import moviesRoutes from "./src/routes/movies.js";
import employeesRoutes from "./src/routes/employees.js";
import clientsRoutes from "./src/routes/clients.js";

import registerEmpRoutes from "./src/routes/registerEmployees.js";
import registerCliRoutes from "./src/routes/registerClients.js";

import loginRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";

import passRecoveryRoutes from "./src/routes/passwordRecovery.js"

//Express application
const app = express();

//JSON middleware
app.use(express.json())

//Cookie parser middleware
app.use(cookieParser());

//API routes
app.use("/api/movies", moviesRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/clients", clientsRoutes);

//Registration routes
app.use("/api/registerEmployees", registerEmpRoutes);
app.use("/api/registerClients", registerCliRoutes);

//Authentication routes
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);

//Password recovery routes
app.use("/api/passwordRecovery", passRecoveryRoutes)

//Export
export default app;