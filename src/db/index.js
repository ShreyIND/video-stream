import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB=async()=>{
    try{
        const conn= await mongoose.connect(process.env.DB_URL+'/'+process.env.DB_NAME);//this will return a promise 
        // so we need to wait for it to resolve before we can use the connection
        console.log(`MongoDB connected: ${conn}`);
        mongoose.connection.on('error',(err)=>{
            console.log("There was an error in the DB connection",err);
            throw err;
        }) 
        console.log('connected to DB');
    }
    catch(err){
        console.log("Error in DB connection",err);
    }
}

export default connectDB;