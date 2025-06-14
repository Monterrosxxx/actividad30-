import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

import clientsSchema from "../models/Clients.js";
import {config} from "../config.js";

const registerCliController = {};

registerCliController.registerNewClient = async (req, res) => {
    const {name, email, password, phoneNumber, address, active} = req.body;

    try {
        //Check if client already exists
        const existingClient = await clientsSchema.findOne({email});
        if(existingClient){
            return res.status(409).json({message: "Client email already registered in system"});
        }

        //Hash password
        const hashedPassword = await bcryptjs.hash(password, 10)

        //Save client data
        const clientData = new clientsSchema({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            address,
            active
        });
            
        await clientData.save();

        //Create verification code
        const emailVerificationCode = crypto.randomBytes(3).toString("hex");

        //Generate verification token
        const verificationToken = jwt.sign(

            //Token payload
            {email, emailVerificationCode},

            //Secret key
            config.JWT.secret,

            //Token expiration
            {expiresIn: "2h"}
        );

        res.cookie("VerificationToken", verificationToken, {maxAge: 2*60*60*1000});

        //Configure email transporter
        const emailTransporter = nodemailer.createTransporter({
            service: "gmail",
            auth: {
                user: config.emailService.userEmail,
                pass: config.emailService.userPassword
            }
        });

        //Email configuration
        const emailOptions = {
            from: config.emailService.userEmail,
            to: email,
            subject: "Account Verification | Email Confirmation",
            text: `Email Verification Required. 
            To activate your account, please enter the following verification code:
            
            ${emailVerificationCode}

            This code expires in 2 hours. Do not share this code with anyone.
            
            Thank you for registering with us!
            `
        }

        //Send verification email
        emailTransporter.sendMail(emailOptions, (error, info) => {
            if (error) return res.status(500).json({message: "Failed to send verification email"})
            console.log("Verification email sent successfully")
        });

        return res.status(201).json({message: "Registration completed. Please verify your email using the code sent to your inbox"})

    } 
    catch (error) {
        console.log("Registration error:", error);
        return res.status(500).json({message: "Registration process failed", error: error.message})
    }
};

//Verify email code
registerCliController.validateEmailCode = async (req, res) => {
    const {verificationCode} = req.body;
    const verificationToken = req.cookies.VerificationToken;

    try {
        //Decode and verify token
        const decodedToken = jwt.verify(verificationToken, config.JWT.secret)
        const {email, emailVerificationCode: storedVerificationCode} = decodedToken;

        //Validate verification code
        if (verificationCode !== storedVerificationCode){
            return res.status(400).json({message: "Invalid verification code provided"})
        }

        //Update verification status
        const clientAccount = await clientsSchema.findOne({email});
        clientAccount.isVerified = true;
        await clientAccount.save();
        
        //Clear verification cookie
        res.clearCookie("VerificationToken");
        
        return res.status(200).json({message: "Email verification completed successfully"});

    }
    catch (error) {
        console.log("Email verification error:", error);
        return res.status(500).json({message: "Email verification process failed", error: error.message})
    };
};

export default registerCliController;