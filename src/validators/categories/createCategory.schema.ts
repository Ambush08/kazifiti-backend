import { z } from 'zod';


const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required')
});


export const categorySchema = z.object({
    body: createCategorySchema
});