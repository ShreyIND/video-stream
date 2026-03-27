import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/index.js';//just using ./db or ./db/index sometime works but to be safe we will use ./db/index.js


dotenv.config();
const app=express();

connectDB().then(()=>{
    app.on('error',(err)=>{
        console.log("Error in DB connection",err);
        throw err;
    });
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log("Error in DB connection",err);
}).finally(()=>{
    console.log("DB connection attempt finished");
});


//db is another continent so we need to wait for the connection to be established before starting the server
// (async ()=>{
//     try{
//         await mongoose.connect(process.env.DB_URL);
//         console.log("Connected to DB");
//         mongoose.connection.on('error',(err)=>{
//             console.log("There was an error in the DB connection",err);
//             throw err;
//         });
//         //if there is an error in the express connection, we need to handle it
//         app.on('error',(err)=>{
//             console.log("Error in DB connection",err);
//             throw err;
//         });
//         app.listen(process.env.PORT,()=>{
//         console.log(`Server is running on port ${process.env.PORT}`);
//         })
//     }
//     catch(err){
//         console.log("Error in DB connection",err);
//     }
// })()