import express from "express"
import { check } from "express-validator"
import { validateRequest } from "../middleware/requestValidation.js";
import {validateToken} from "../middleware/tokenValidation.js"
import { register, login } from "../controllers/authController.js";

export const router = express.Router();

router.post('/register',
    check("email")
        .exists()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid Email")
        .normalizeEmail(),
    check("name")
        .exists()
        .withMessage("Name is required")
        .notEmpty()
        .withMessage("Name must not be empty")
        .trim()
        .escape(),
    check("phone")
        .exists()
        .withMessage("Phone Number is required")
        .isMobilePhone()
        .withMessage("Invalid Mobile Number"),
    check("password")
        .exists()
        .withMessage("Password is required")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 chars long"),
    validateRequest,
    register
)

router.post('/login',
    check("email")
        .isEmail()
        .withMessage("Invalid Email")
        .trim()
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Must be at least 8 chars long"),
    validateRequest,
    login
)
