import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser=asyncHandler(async(req,res)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        message:"User registered successfully",
    })
})

const loginUser=asyncHandler(async(req,res)=>{
    try{
    const user=req.user;
    if(!user){
        res.code=401;
        throw new Error("Invalid credentials");
    }
    if(user.passwordMatch(req.body.password)){
        const token=await user.generateJwtToken();
        const refreshToken=await user.generateRefreshToken();
        user.refreshToken=refreshToken;
        const Option={
            httpOnly:true,
        }
        res.cookie("refreshToken",refreshToken,Option);
        await user.save();
        res.cookie("token",token,Option);
        res.status(200).json({
            success:true,
            message:"User logged in successfully",
            token:token,
        })
    }
    else{
        res.code=401;
        throw new Error("Invalid credentials");
    }
}catch(err){
    res.status(res.code||500).json({
        success:false,
        message:err.message||"Something went wrong"
    })
}
});

const logoutUser=asyncHandler(async(req,res)=>{
    const user=req.user;
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