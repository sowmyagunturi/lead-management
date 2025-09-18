import mongoose from 'mongoose'
import dotenv from "dotenv";
dotenv.config(); // <-- load .env before importing db

const mongo_url = process.env.MONG_CONN;

mongoose.connect(mongo_url)
    .then(()=>{
        console.log("MongoDB Connected...");
    }).catch((err)=>{
        console.log('MongoDB Connection Error: ',err);
    })

export default mongoose
