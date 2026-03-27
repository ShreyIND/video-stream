import mongoose from 'mongoose'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
dotenv.config();//you can also use in package.json "start": "dotenv -e .env node src/index.js" 
// and then you don't need to use dotenv.config() in every file

const userSchema=new mongoose.Schema({
    id:{
        'type':String,
        'required':true,
        'unique':true
    },
    watchHistory:[{
        'type':mongoose.Schema.Types.ObjectId,
        'ref':'Video'
    }],
    userName:{
        'type':String,
        'required':true, 
        'index':true,
        'unique':true  
    },
    fullName:{
        'type':String,
        'required':true,
        'trim':true,
        'index':true
    },
    email:{
        'type':String,
        'required':true,  
        'unique':true

    },
    password:{
        'type':String,
        'required':true,  
    },
    avatarUrl:{
        'type':String,
        'required':false
    },
    coverImageUrl:{
        'type':String,
        'required':false
    },
    refreshToken:{
        'type':String,
        'required':true
    }
},{
    timestamps:true
})


userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
})

userSchema.methods.passwordMatch=async function(password){
    if(password){
        return await bcrypt.compare(password,this.password);
    }
    else{
        return false;
    }
}

userSchema.methods.generateJwtToken= function(){
    return  jwt.sign({
        id:this._id,
        name:this.fullName,
        userName:this.userName,
        email:this.email
    }
    ,process.env.JWT_SECRET
    ,{
        expiresIn:process.env.JWT_EXPIRES_IN
    }
    )
}

//not necessary to use async await here because jwt.sign is not an asynchronous function,
//  but we are using it to keep the consistency in the code 
// and also to make it easier to use in the future 
// if we want to change the implementation of jwt.sign to an asynchronous function


userSchema.methods.generateRefreshToken=function(){
    return  jwt.sign({
        id:this._id
    }
    ,process.env.REFRESH_TOKEN_SECRET
    ,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN
    }
    )
}

const User=mongoose.model('User',userSchema);

export default User;