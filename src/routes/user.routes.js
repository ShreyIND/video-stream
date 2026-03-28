import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import protect from "../middlewares/auth.middleware.js";
const router=Router();
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);
// router.route("/register").post(registerUser);//calling the callback function registerUser when the route is hit with a POST request
//http://localhost:5000/api/v1/users/register
router.route("/login").post(loginUser);//calling the callback function loginUser when the route is hit with a POST request
//http://localhost:5000/api/v1/users/login


router.post("/logout", protect, logoutUser);//http://localhost:5000/api/v1/users/logout

export default router;


//controller part is logic
//routes part is end point
//app.js is where we are using the routes