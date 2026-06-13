import express from "express";
import cors from 'cors'
import "dotenv/config.js";
import connectDB from "./lib/db.js";
import dns from "dns";
import { clerkMiddleware } from '@clerk/express'

dns.setServers(["1.1.1.1", "8.8.8.8"]);
const app = express();

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(express.json())
app.use(cors({origin: FRONTEND_URL, credentials: true}))
app.use(clerkMiddleware())


app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening on ${PORT} port 😊`);
});
