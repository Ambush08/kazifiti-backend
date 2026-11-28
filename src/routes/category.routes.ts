import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import validate from "../middlewares/validate.js";
import { categorySchema } from "../validators/categories/createCategory.schema.js";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../controllers/category/category.controller.js";



const router = Router();


//Create category route
router.post('/create', authenticate, adminAuth, validate(categorySchema), createCategory);


//Get all categories route
router.get('/', getCategories);


//get category by id
router.get('/category/:id', authenticate, adminAuth, getCategory);


//Update category route
router.put('/update/:id', authenticate, adminAuth, validate(categorySchema), updateCategory);


//Delete category route
router.delete('/delete/:id', authenticate, adminAuth, deleteCategory);



export default router;