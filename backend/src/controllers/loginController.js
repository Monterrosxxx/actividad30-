import clientsSchema from "../models/Clients.js";
import employeesSchema from "../models/Employees.js";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import {config} from "../config.js";

const loginController = {};

loginController.authenticateUser = async (req, res) => {
    const {email, password} = req.body;

    try{
        //Determine user type and validate credentials
        let userAccount; //Found user account
        let accountType; //Type of user account

        //Admin verification
        if (email === config.adminCredentials.email && password === config.adminCredentials.password){
            accountType = "Admin";
            userAccount = {_id: "Admin"};
        }

        else {
            //Employee verification
            userAccount = await employeesSchema.findOne({email});
            accountType = "Employee";

            //Client verification
            if (!userAccount){
                userAccount = await clientsSchema.findOne({email});
                accountType = "Client";
            }
        }

        //Account not found
        if (!userAccount){
            return res.status(404).json({message: "Account not registered in the system"});
        }

        //For non-admin accounts
        if (accountType !== "Admin"){

            //Verify password hash
            const passwordMatch = bcryptjs.compare(password, userAccount.password)

            //Incorrect password
            if (!passwordMatch){
                return res.status(401).json({message: "Incorrect password provided"})
            }
        }

        //Create authentication token
        jwt.sign(
            {id: userAccount._id, accountType},
            config.JWT.secret,
            {expiresIn: config.JWT.expiresIn},
            (error, token) => {
                if (error) {
                    console.log("Token generation error:", error);
                    return res.status(500).json({message: "Authentication token creation failed"});
                }
                res.cookie("authToken", token);
                return res.status(200).json({message: "Authentication successful"})
            }
        )

    }
    catch(error){
        console.log("Login process error:", error);
        return res.status(500).json({message: "Authentication process failed", error: error.message})
    }
};

export default loginController;