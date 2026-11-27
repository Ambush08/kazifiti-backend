import { Router } from "express";
import validate from "../middlewares/validate.js";
import { forgotPassword, LoginUser, logoutUser, refreshTokenHandler, registerUser, resetPasswordHandler, verifyEmailHandler } from "../controllers/users/user.controller.js";
import registerSchema, { forgotPasswordSchema, loginSchema, resetPasswordSchema } from "../validators/users/createUser.schema.js";
import { registerCompanySchema } from "../validators/company/createCompany.schema.js";
import { registerEmployer } from "../controllers/employers/employer.controler.js";
import { uploadLogo } from "../middlewares/multer.js";

const router = Router();


//Register user route
router.post('/register', validate(registerSchema), registerUser);


//Verify email route
router.get('/verify-email', verifyEmailHandler);


//Login user route
router.post('/login', validate(loginSchema), LoginUser);


//Refresh token 
router.post('/refresh-token', refreshTokenHandler);


//Forgot passwword
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);


//Passord reset
router.post('/password-reset', validate(resetPasswordSchema), resetPasswordHandler);


//Logout user route
router.post('/logout', logoutUser);


//Register recruiter
router.post('/recruiter/register', uploadLogo.single('logo'), validate(registerCompanySchema), registerEmployer);

export default router;