import express from "express"
import { check } from "express-validator";
import { validateRequest } from "../middleware/requestValidation.js";
import { validateToken } from "../middleware/tokenValidation.js";
import * as taskController from "../controllers/taskController.js"
import { convertToUpperCase } from "../utils/utils.js";
import { areValid, isValidPriority } from "../middleware/requestValidation.js";
export const router = express.Router();

router.post("/add", 
    check("title")
        .exists()
        .withMessage("Task Title is Required")
        .isString()
        .withMessage("Title Must be a string")
        .isString()
        .withMessage("Title Must be a string")
        .notEmpty()
        .withMessage("Task Title is Required")
        .trim()
        .escape(),
    check("repeatDays")
        .exists()
        .withMessage("Days to Repeat Tasks are required")
        .isArray({ min: 1 })
        .withMessage('Days to Repeat Tasks are required')
        .customSanitizer(convertToUpperCase)
        .custom(areValid)
        .withMessage("Invalid day name"),
    check("priority")
        .exists()
        .withMessage("Priority is Required")
        .isString()
        .withMessage("Priority must be a string")
        .toUpperCase()
        .custom(isValidPriority)
        .withMessage("Invalid Priority"),
    validateRequest,
    validateToken,
    taskController.addTask
)

router.put("/edit",
    check("id")
        .exists()
        .withMessage("Id is required")
        .isNumeric()
        .withMessage("Id must be a number"),
    check("title")
        .optional()
        .isString()
        .withMessage("Title Must be a string")
        .notEmpty()
        .withMessage("New Title Can't be empty")
        .trim()
        .escape(),
    check("repeatDays")
        .optional()
        .isArray({ min: 1 })
        .withMessage('Array cannot be empty')
        .customSanitizer(convertToUpperCase)
        .custom(areValid)
        .withMessage("Invalid day name"),
    check("priority")
        .optional()
        .isString()
        .withMessage("Priority must be a string")
        .trim()
        .toUpperCase()
        .custom(isValidPriority)
        .withMessage("Invalid Priority"),
    validateRequest,
    validateToken,
    taskController.editTask
)

router.patch("/status",
    check("id")
        .exists()
        .withMessage("Id is rquired")
        .isNumeric()
        .withMessage("Id must be a number"),
    check("status")
        .exists()
        .withMessage("Status is required")
        .isString()
        .withMessage("Status must be a string"),
    validateRequest,
    validateToken,
    taskController.changeStatus
)

router.delete("/delete",
    check("id")
    .exists()
    .withMessage("id is required")
    .isNumeric()
    .withMessage("id must be a number"),
    validateRequest,
    validateToken,
    taskController.deleteTask
)

router.get("/today",
    validateRequest,
    validateToken,
    taskController.getTodayTasks
)


router.get("/completed",
    validateRequest,
    validateToken,
    taskController.getCompletedTasks
)

router.patch("/markComplete",
    validateRequest,
    validateToken,
    taskController.markCompleted
)

router.get("/all",
    validateRequest,
    validateToken,
    taskController.getAllTasks
)