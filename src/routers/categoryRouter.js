import express from "express"
import { check } from "express-validator"
import { validateRequest } from "../middleware/requestValidation.js";
import {validateToken} from "../middleware/tokenValidation.js"
import * as categoryController from "../controllers/categoryController.js"

export const router = new express.Router();

router.post("/add",
    check("name")
    .exists()
    .withMessage("Category Name is required")
    .isString()
    .withMessage("Category Name must be a string")
    .notEmpty()
    .withMessage("Category name must not be empty")
    .trim()
    .escape(),
    validateRequest,
    validateToken,
    categoryController.addCategory
)