import { Router } from "express";
import validate from "../middlewares/validate.js";
import { registerUser } from "../controllers/users/user.controller.js";
import registerSchema from "../validators/users/createUser.schema.js";

const router = Router();


//Register user route
router.post('/register', validate(registerSchema), registerUser);




export default router;