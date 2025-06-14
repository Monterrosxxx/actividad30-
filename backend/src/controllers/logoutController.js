const logoutController = {};

logoutController.terminateSession = async (req, res) => {
    try {
        //Clear authentication cookies
        res.clearCookie("authToken");

        //Confirm logout
        return res.status(200).json({message: "Session terminated successfully"})
    } catch (error) {
        return res.status(500).json({message: "Error during logout process", error: error.message})
    }
}

//Export
export default logoutController;