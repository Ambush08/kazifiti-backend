import { Router } from "express";
import validate from "../middlewares/validate.js";
import { registerUser, verifyEmailHandler } from "../controllers/users/user.controller.js";
import registerSchema from "../validators/users/createUser.schema.js";

const router = Router();


//Register user route
router.post('/register', validate(registerSchema), registerUser);


//Verify email route
router.get('/verify-email', verifyEmailHandler);

export default router;