const employeesController = {};
import employeesSchema from "../models/Employees.js";

//Get all employees
employeesController.getAllEmployees = async(req, res) => {
    try {
        const employeesList = await employeesSchema.find();
        return res.status(200).json(employeesList);
    } catch (error) {
        return res.status(500).json({message: "Error retrieving employees data", error: error.message});
    }
};

//Create new employee
employeesController.createEmployee = async(req, res) => {
    try {
        const {name, email, password, phoneNumber, address, charge, employmentDate, salary, active} = req.body;
        const employeeData = new employeesSchema({name, email, password, phoneNumber, address, charge, employmentDate, salary, active});
        await employeeData.save();
        return res.status(201).json({message: "Employee successfully registered"});
    } catch (error) {
        return res.status(500).json({message: "Failed to register employee", error: error.message});
    }
};

//Remove employee
employeesController.removeEmployee = async(req, res) => {
    try {
        await employeesSchema.findByIdAndDelete(req.params.id);
        return res.status(200).json({message: "Employee successfully removed"});
    } catch (error) {
        return res.status(500).json({message: "Error removing employee", error: error.message});
    }
};

//Modify employee
employeesController.modifyEmployee = async(req, res) => {
    try {
        const {name, email, password, phoneNumber, address, charge, employmentDate, salary, active} = req.body;
        const updatedEmployee = await employeesSchema.findByIdAndUpdate(req.params.id, {name, email, password, phoneNumber, address, charge, employmentDate, salary, active}, {new: true});
        if (!updatedEmployee) {
            return res.status(404).json({message: "Employee not found"});
        }
        return res.status(200).json({message: "Employee data updated successfully"});
    } catch (error) {
        return res.status(500).json({message: "Error updating employee information", error: error.message});
    }
};

//Export Controller
export default employeesController;