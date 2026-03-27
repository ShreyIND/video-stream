const asyncHandler=(fn)=>async (req,res,next)=>{
    return Promise.resolve(fn(req,res,next)).catch((err)=>{
        res.status(res.code||500).json({
            success:false,
            message:err.message||"Something went wrong"
        })
    })
}
export  {asyncHandler};

// const asyncHandler = (fn)=>async (req, res, next)=>{
//     try{
//         return await fn(req, res, next);
//     }
//     catch(err){
//         res.status(res.code||500).json({
//             success:false,
//             message:err.message||"Something went wrong"
//         })
//         return null; 
//     }
// }

// export default asyncHandler;

