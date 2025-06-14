/*
    Campos:
        name
        email
        password
        phoneNumber
        address
        charge
        employmentDate
        salary
        active
*/

//Importar Mongoose
import {Schema, model} from "mongoose";

//Schema
const employeesSchema = new Schema({
    name: {
        type: String,
        maxLengh: 25,
        require: true
    },

    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true
    },

    phoneNumber: {
        type: String,
        maxLengh: 8,
        require: true
    },

    address: {
        type: String,
        require: true
    },

    charge: {
        type: String,
        require: true
    },

    employmentDate: {
        type: Date,
        require: true
    },

    salary: {
        type: Number,
        require: true
    },

    active: {
        type: Boolean,
        require: true
    }

}, {
    timestamps: true,
    strict: false
});

export default model("Employees", employeesSchema);