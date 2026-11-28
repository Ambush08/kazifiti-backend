import { Request, Response } from "express";
import type { RequestAuth } from "../../middlewares/authenticate.js";
import * as categoryServices from "../../services/categories/category.services.js";
import toSlug from "../../utils/slug.js";
import { AppError } from "../../errors/AppError.js";

//Create a category
export const createCategory = async (req: RequestAuth, res: Response) => {
  try {
    const { name } = req.body;

    const slug = toSlug(name);

    const category = await categoryServices.createCategoryService({
      name,
      slug,
    });

    req.log.info(
      { reason: "category_created" },
      "Category created successfully",
    );

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error: any) {
    req.log.error({ err: error }, "Failed to create category");

    if ((error?.code ?? error?.cause?.code) === "23505") {
      throw new AppError(409, "Category already exists");
    }

    throw new AppError(500, "Internal server error");
  }
};

//Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryServices.getCategoriesService();

    req.log.info({ reason: "fetch_categories" }, "Fetch all categories");

    return res.status(200).json({
      categories,
    });
  } catch (error) {
    req.log.error({ err: error }, "Failed to fetch categories");

    throw new AppError(500, "Internal server error");
  }
};

//Get category by id
export const getCategory = async (req: RequestAuth, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!id) {
      req.log.warn({ reason: "missing_category_id" }, "Missing category id");

      throw new AppError(400, "Missing category id");
    }

    const category = await categoryServices.getCategoryService(id);

    if (!category) throw new AppError(404, "Category not found");

    req.log.info({ reason: "fetch_category" });

    return res.status(200).json({
      category,
    });
  } catch (error) {
    req.log.error({ err: error }, "Failed to get category");

    throw new AppError(500, "Internal server error");
  }
};

//Update category
export const updateCategory = async (req: RequestAuth, res: Response) => {
  try {
    const { name } = req.body;

    const id = req.params.id as string;

    if (!id) {
      req.log.info({ reason: "missing_id" });
      return res.status(400).json({
        message: "Missing category id",
      });
    }

    const slug = toSlug(name);

    const category = await categoryServices.updateCategoryService(id, {
      name,
      slug,
    });

    if (!category) {
      req.log.warn(
        { reason: "invalid_category_id" },
        "Failed to update category",
      );
      throw new AppError(404, "Catgory not found");
    }

    req.log.info(
      { reason: "category_updated" },
      "Category updated",
    );

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    
    if ((error?.code ?? error?.cause?.code) === "23505") {
      throw new AppError(409, "Category already exists");
    }

    req.log.error({ err: error }, "Failed to update category");

    throw new AppError(500, "Internal server error");
  }
};


//Delete category
export const deleteCategory = async (req: RequestAuth, res: Response) => {
    try {
        const id = req.params.id as string;

        if(!id){
            req.log.warn({ reason: 'missing-category_id'}, 'Missing category id');
            throw new AppError(400, 'Missing category id');
        }

        const category = await categoryServices.deleteCategoryService(id);

        req.log.info({ reason: 'category_deleted'});


        return res.status(200).json({
            message: "Catgory delete successfully",
            category
        })
    } catch (error) {
        if (error instanceof AppError) throw error;
        
        req.log.error({ err: error}, 'Failed to delete category');

        throw new AppError(500, 'Internal server error')
    }
}
