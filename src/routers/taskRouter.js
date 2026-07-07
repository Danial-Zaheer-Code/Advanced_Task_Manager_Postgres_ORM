import express from "express"
import { check } from "express-validator";
import { validateRequest } from "../middleware/requestValidation.js";
import { validateToken } from "../middleware/tokenValidation.js";
import * as taskController from "../controllers/taskController.js"
import { convertToUpperCase } from "../utils/utils.js";
import { areValid, isValidPriority, isValidStatus, isValidDueDate } from "../middleware/requestValidation.js";
export const router = express.Router();

router.post("/add",
    check("title")
        .exists()
        .withMessage("Task Title is Required")
        .isString()
        .withMessage("Title Must be a string")
        .notEmpty()
        .withMessage("Task Title cannot be empty")
        .trim()
        .escape(),
    check("priority")
        .exists()
        .withMessage("Priority is Required")
        .isString()
        .withMessage("Priority must be a string")
        .toUpperCase()
        .custom(isValidPriority)
        .withMessage("Invalid Priority"),
    check("repeatDays")
        .optional()
        .customSanitizer(repeatDays => {
            return repeatDays ?? [];
        })
        .customSanitizer(convertToUpperCase)
        .custom(areValid)
        .withMessage("Invalid day name"),
    check("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due Date must be a valid date")
        .toDate()
        .custom(isValidDueDate)
        .withMessage("Due date can't be in the past"),
    check("description")
        .optional()
        .isString()
        .withMessage("Description must be a string")
        .trim()
        .escape(),
    check("categoryId")
        .optional()
        .isNumeric()
        .withMessage("Category Id must be a number")
        .customSanitizer(id => {
            return Number(id)
        }),
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
    check("data")
        .exists()
        .withMessage("Data object is required")
        .isObject()
        .withMessage("Data Object is required"),
    check("data.title")
        .optional()
        .isString()
        .withMessage("Title Must be a string")
        .notEmpty()
        .withMessage("New Title Can't be empty")
        .trim()
        .escape(),
    check("data.repeatDays")
        .optional()
        .isArray()
        .withMessage('Repeat days must be an array')
        .customSanitizer(convertToUpperCase)
        .custom(areValid)
        .withMessage("Invalid day name"),
    check("data.priority")
        .optional()
        .isString()
        .withMessage("Priority must be a string")
        .trim()
        .toUpperCase()
        .custom(isValidPriority)
        .withMessage("Invalid Priority"),
    check("data.status")
        .optional()
        .isString()
        .withMessage("Status must be a string")
        .toUpperCase()
        .custom(isValidStatus)
        .withMessage("Invalid Status"),
    check("data.dueDate")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("Due Date must be a valid date")
        .toDate()
        .custom(isValidDueDate)
        .withMessage("Due date can't be in the past"),
    check("data.description")
        .optional()
        .isString()
        .withMessage("Description must be a string")
        .trim()
        .escape(),
    check("data.categoryId")
        .optional()
        .isNumeric()
        .withMessage("Category Id must be a number")
        .customSanitizer(id => {
            return Number(id)
        }),
    validateRequest,
    validateToken,
    taskController.editTask
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
    check("id")
        .exists()
        .withMessage("id is required")
        .isNumeric()
        .withMessage("id must be a number"),
    validateRequest,
    validateToken,
    taskController.markCompleted
)

router.get("/all",
    validateRequest,
    validateToken,
    taskController.getAllTasks
)