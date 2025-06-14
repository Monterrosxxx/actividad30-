const clientsController = {};
import clientsSchema from "../models/Clients.js";

//Get all clients
clientsController.getAllClients = async(req, res) => {
    try {
        const clientsList = await clientsSchema.find();
        return res.status(200).json(clientsList);
    } catch (error) {
        return res.status(500).json({message: "Error retrieving clients data", error: error.message});
    }
};

//Create new client
clientsController.createClient = async(req, res) => {
    try {
        const {name, email, password, phoneNumber, address, active} = req.body;
        const clientData = new clientsSchema({name, email, password, phoneNumber, address, active});
        await clientData.save();
        return res.status(201).json({message: "Client successfully created"});
    } catch (error) {
        return res.status(500).json({message: "Failed to create client", error: error.message});
    }
};

//Remove client
clientsController.removeClient = async(req, res) => {
    try {
        await clientsSchema.findByIdAndDelete(req.params.id);
        return res.status(200).json({message: "Client successfully deleted"});
    } catch (error) {
        return res.status(500).json({message: "Error deleting client", error: error.message});
    }
};

//Modify client
clientsController.modifyClient = async(req, res) => {
    try {
        const {name, email, password, phoneNumber, address, active} = req.body;
        const updatedClient = await clientsSchema.findByIdAndUpdate(req.params.id, {name, email, password, phoneNumber, address, active}, {new: true});
        if (!updatedClient) {
            return res.status(404).json({message: "Client not found"});
        }
        return res.status(200).json({message: "Client information updated successfully"});
    } catch (error) {
        return res.status(500).json({message: "Error updating client data", error: error.message});
    }
};

//Export Controller
export default clientsController;