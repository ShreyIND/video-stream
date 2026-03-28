import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import  {uploadCloudinary}  from "../utils/cloudinary.connect.js";

const registerUser=asyncHandler(async(req,res)=>{
    //get user details from the frontend
    //validation for the detail 
    //check user if exists or not
    //check for image
    //upload them for cloudinary
    //create user in database
    //remove pass and refresh token from the response
    //send response to the frontend
    const {fullName,email,password,userName}=req.body;
    if(!fullName || !email || !password || !userName){
        res.code=400;
        throw new Error("All fields are required");
    }   
    const existingUser=await User.findOne({
        $or: [{ email }, { userName: userName }]
    });
    if(existingUser){
        res.code=400;
        throw new Error("User already exists");
    }   
    const avatarPath=req.files?.avatar?.[0]?.path;    //?is used to check if the file is present or not,
    //  if not then it will return undefined instead of throwing an error
    const coverPath=req.files?.coverImage?.[0]?.path;

    if(!avatarPath || !coverPath){
        res.code=400;
        throw new Error("Avatar and cover image are required");
    }
    const avatarUrl=await uploadCloudinary(avatarPath,"avatar");
    const coverImageUrl=await uploadCloudinary(coverPath,"cover");

    if (!avatarUrl || !coverImageUrl) {
    res.code = 500;
    throw new Error("Image upload failed");
    }
    const user=await User.create({
        fullName,
        email,
        password,
        userName:userName,
        avatarUrl:avatarUrl?.url||"",
        coverImageUrl:coverImageUrl?.url||"",
    })
    const token=await user.generateJwtToken();
    const  refreshToken=await user.generateRefreshToken();
    res.cookie("token", token, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    user.refreshToken=refreshToken;
    await user.save();
    const createdUser=await User.findById(user._id).select("-password -refreshToken");
    res.status(201).json({
        success:true,
        message:"User registered successfully",
        user:createdUser
    })
});


const loginUser = asyncHandler(async (req, res) => {

    const { userName, email, password } = req.body;

    if (!email && !userName) {
        res.status(400);
        throw new Error("Email or username is required");
    }

    if (!password) {
        res.status(400);
        throw new Error("Password is required");
    }

    const query = [];
    if (email) query.push({ email });
    if (userName) query.push({ userName });

    const user = await User.findOne({ $or: query });

    if (!user) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    const isMatch = await user.passwordMatch(password);

    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    const token = await user.generateJwtToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    const options = {
        httpOnly: true
    };

    res.cookie("token", token, options);

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token
    });
});

const logoutUser=asyncHandler(async(req,res)=>{
    console.log("Cookies:", req.user);
    const user=req.user;
    if(!user){
        res.code=401;
        throw new Error("Invalid credentials");
    }
    user.refreshToken="";   
    await user.save();
    res.clearCookie("refreshToken");
    res.clearCookie("token");
    res.status(200).json({
        success:true,
        message:"User logged out successfully",
    })
});


export {registerUser, loginUser, logoutUser};