import db from "../../db/index.js";
import { categories, type Category, type NewCategory } from "../../db/schema/categories.schema.js";
import { and, asc, eq } from "drizzle-orm";
import { AppError } from "../../errors/AppError.js";



//Create category service
export const createCategoryService = async (data: NewCategory) => {
    const [category] = await db
    .insert(categories)
    .values(data)
    .returning({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        createdAt: categories.createdAt,
    });

    return category;
};


//Get categories service
export const getCategoriesService = async () => {
    return await db.query.categories.findMany({
        orderBy: asc(categories.name)
    });
}



//Get single category
export const getCategoryService = async (id: string) => {
    const category = await db.query
    .categories
    .findFirst({
        where: eq(categories.id, id)
    });

    if(!category) throw new AppError(404, 'Catory not found')

    return category;
}


//Update category service
export const updateCategoryService = async (id: string, data: NewCategory) => {
    const [category] = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, id))
    .returning({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        updatedAt: categories.updatedAt
    });

    if(!category) throw new AppError(404, 'Category not found')
    return category;
}



//Delete category service
export const deleteCategoryService = async (id: string) => {
    const [category] = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning({
        categoryId: categories.id,
        name: categories.name,
        slug: categories.slug
    });

    if(!category) throw new AppError(404, 'Category not found');

    return category;
}