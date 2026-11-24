import { Router } from "express";
import validate from "../middlewares/validate.js";
import { LoginUser, refreshTokenHandler, registerUser, verifyEmailHandler } from "../controllers/users/user.controller.js";
import registerSchema, { loginSchema } from "../validators/users/createUser.schema.js";

const router = Router();


//Register user route
router.post('/register', validate(registerSchema), registerUser);


//Verify email route
router.get('/verify-email', verifyEmailHandler);


//Login user route
router.post('/login', validate(loginSchema), LoginUser);


//Refresh token 
router.post('/refresh-token', refreshTokenHandler);

export default router;