//Import
import dotenv from "dotenv";

//Start dotenv
dotenv.config();

//Configurations
export const config = {
    database: {
        URI: process.env.DB_URI,
    },

    server: {
        PORT: process.env.PORT,
    },

    JWT: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES,
    },

    adminCredentials: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
    },

    emailService: {
        userEmail: process.env.USER_EMAIL,
        userPassword: process.env.USER_PASS
    },

    cloudinaryConfig: {
        cloudName: process.env.CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
};