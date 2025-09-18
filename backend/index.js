import express from 'express'
const app = express();
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();
import db from './Models/db.js'
import AuthRoute from './Routes/AuthRoute.js'
import LeadRoute from './Routes/LeadRoute.js'
import cookieParser from "cookie-parser";
app.use(cookieParser());
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
  origin: "https://lead-management-n.onrender.com",
  credentials: true
}));

app.use('/auth',AuthRoute);
app.use('/leads',LeadRoute);

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
})
