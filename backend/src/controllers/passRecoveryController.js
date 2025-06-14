//Imports
import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcryptjs";

import ClientsSchema from "../models/Clients.js";
import EmployeesSchema from "../models/Employees.js";

import {sendRecoveryEmail, generateRecoveryHTML} from "../utils/passwordRecovery.js";
import {config} from "../config.js";

const passRecoveryController = {}

passRecoveryController.sendRecoveryCode = async (req, res) => {
    const {email} = req.body;

    try {
        let userAccount;
        let accountType; 
        
        userAccount = await ClientsSchema.findOne({email});
        if (userAccount) {
            accountType = "client";
        }
        else {
            userAccount = await EmployeesSchema.findOne({email});
            accountType = "employee";
        }

        if(!userAccount){
            return res.status(404).json({message: "No account found with this email address"});
        }

        //Generate recovery code
        const recoveryCode = Math.floor(10000 + Math.random() * 60000).toString();

        //Create recovery token
        const recoveryToken = jwt.sign(
            //Token payload
            {email, recoveryCode, accountType, verified: false},

            //Secret key
            config.JWT.secret,

            //Token expiration
            {expiresIn: "25m"}
        )

        //Set recovery cookie
        res.cookie("tokenRecoveryCode", recoveryToken, {maxAge: 25 * 60 * 1000});

        //Send recovery email
        await sendRecoveryEmail(
            email,
            "Password Reset Request",
            `Your password recovery verification code is ${recoveryCode}`,
            generateRecoveryHTML(recoveryCode)
        )

        return res.status(200).json({message: "Password recovery email sent successfully"});
    } 
    catch (error) {
        console.log("Recovery code sending error: " + error);
        return res.status(500).json({message: "Failed to process recovery request", error: error.message});
    };
};

//Validate recovery code
passRecoveryController.validateRecoveryCode = async (req, res) => {
    const {code} = req.body;

    try {
        //Get recovery token
        const recoveryToken = req.cookies.tokenRecoveryCode;

        if (!recoveryToken) {
            return res.status(400).json({message: "No recovery session found"});
        }

        //Decode token information
        const decodedData = jwt.verify(recoveryToken, config.JWT.secret);

        //Verify code
        if (decodedData.recoveryCode !== code) {
            return res.status(400).json({message: "Invalid recovery code provided"});
        }

        //Create verified token
        const verifiedToken = jwt.sign(
            //Token payload
            {
                email: decodedData.email, 
                recoveryCode: decodedData.recoveryCode,
                accountType: decodedData.accountType,
                verified: true 
            },

            //Secret key
            config.JWT.secret,

            //Token expiration
            {expiresIn: "25m"}
        )

        //Update recovery cookie
        res.cookie("tokenRecoveryCode", verifiedToken, {maxAge: 25 * 60 * 1000})
        return res.status(200).json({message: "Recovery code validated successfully"});

    } 
    catch (error) {
        console.log("Code validation error: " + error);
        return res.status(500).json({message: "Code verification process failed", error: error.message});
    };
};

passRecoveryController.updatePassword = async (req, res) => {
    const {newPassword} = req.body;

    try {
        //Get recovery token
        const recoveryToken = req.cookies.tokenRecoveryCode;
        
        if (!recoveryToken) {
            return res.status(400).json({message: "No recovery session found"});
        }

        //Decode token information
        const decodedData = jwt.verify(recoveryToken, config.JWT.secret);

        //Check verification status
        if (!decodedData.verified) {
            return res.status(400).json({message: "Recovery code not verified yet"})
        }

        let userAccount;
        const {email} = decodedData

        //Hash new password
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        //Update password based on account type
        if (decodedData.accountType === "client") {
            userAccount = await ClientsSchema.findOneAndUpdate(
                {email},
                {password: newHashedPassword},
                {new: true}
            )
        }

        else if (decodedData.accountType === "employee") {
            userAccount = await EmployeesSchema.findOneAndUpdate(
                {email},
                {password: newHashedPassword},
                {new: true}
            )
        }
        
        res.clearCookie("tokenRecoveryCode");

        return res.status(200).json({message: "Password updated successfully"});

    } 
    catch (error) {
        console.log("Password update error: " + error);
        return res.status(500).json({message: "Password update process failed", error: error.message});
    }
}

//Export
export default passRecoveryController;