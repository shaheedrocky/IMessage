import mongoose from "mongoose";
import dns from "node:dns";

// Force Node.js to use Google and Cloudflare DNS to reliably resolve MongoDB Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (dnsErr) {
  console.warn("Failed to set custom DNS servers, falling back to system default:", dnsErr.message);
}

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