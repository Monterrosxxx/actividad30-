const registerEmpController = {};

import EmployeeSchema from "../models/Employees.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import {config} from "../config.js";

//Create new employee
registerEmpController.createNewEmployee = async(req, res) => {
    const {name, email, password, phoneNumber, address, charge, employmentDate, salary, active} = req.body;
    
    try {
        //Verify if employee already exists
        const employeeExists = await EmployeeSchema.findOne({email});
        if (employeeExists){
            return res.status(409).json({message: "Employee email already registered in system"});
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create employee record
        const employeeData = new EmployeeSchema({
            name, 
            email, 
            password: hashedPassword, 
            phoneNumber, 
            address, 
            charge, 
            employmentDate, 
            salary, 
            active
        });

        await employeeData.save();

        //Generate authentication token
        jsonwebtoken.sign(

            //Token payload
            {id: employeeData._id},
            
            //Secret key
            config.JWT.secret,

            //Token expiration
            {expiresIn: config.JWT.expiresIn},

            //Callback function
            (error, authToken) => {
                if (error) {
                    console.log("Token generation error:", error);
                    return res.status(500).json({message: "Authentication token creation failed"});
                }
                res.cookie("authToken", authToken);
                return res.status(201).json({message: "Employee registration completed successfully"})
            }
        );
    }
    catch(error){
        console.log("Employee registration error:", error);
        return res.status(500).json({message: "Employee registration process failed", error: error.message});
    }
}

export default registerEmpController;