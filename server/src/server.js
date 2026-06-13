import express from 'express';
import "dotenv/config.js";

const app = express();
const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
    console.log(`Server is listening on ${PORT} port 😊`);
})