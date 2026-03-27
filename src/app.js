import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}));

//configuring the express app to use the json parser middleware and urlencoded parser middleware


app.use(express.json({'limit':'16kb'}));//this will parse the incoming request body and make it available in req.body
//this will mostly used in form submissions and in APIs where we need to send data in the request body

app.use(urlencoded({extended:true,'limit':'16kb'}));
//this will parse the incoming request body and make it available in req.body
//this will mostly used in url
app.use(express.static('public'));//this will serve the static files from the public folder
app.use(cookieParser());//this will parse the cookies and make it available in req.cookies


export default {app};