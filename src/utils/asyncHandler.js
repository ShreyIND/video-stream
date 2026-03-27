const asynHandler=(fn)=>async (req,res,next)=>{
    Promise.resolve(fn(req,res,next)).catch((err)=>{
        res.status(res.code||500).json({
            success:false,
            message:err.message||"Something went wrong"
        })
    })
}
export {asynHandler};

// const asyncHandler = (fn)=>async (req, res, next)=>{
//     try{
//         await fn(req, res, next);
//     }
//     catch(err){
//         res.status(res.code||500).json({
//             success:false,
//             message:err.message||"Something went wrong"
//         })
//     }
// }

// export default asyncHandler;

