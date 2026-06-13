import mongoose from "mongoose";

async function connectDB() {
    try {
        const dbUri = process.env.MONGO_URI;
        if(!dbUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        const dbConnection = await mongoose.connect(dbUri);
        console.log(`Connected to MongoDB: ${dbConnection.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;