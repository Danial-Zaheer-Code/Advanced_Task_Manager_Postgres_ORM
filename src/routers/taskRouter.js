import express from "express"
import { check } from "express-validator";
import { validateRequest } from "../middleware/requestValidation.js";
import { validateToken } from "../middleware/tokenValidation.js";
import * as taskController from "../controllers/taskController.js"
export const router = express.Router();

router.post("/add", 
    check("title")
        .exists()
        .withMessage("Task Title is Required")
        .notEmpty()
        .withMessage("Task Title is Required")
        .trim()
        .escape(),
    check("repeatDays")
        .exists()
        .withMessage("Days to Repeat Tasks is compulsory")
        .isArray({ min: 1 })
        .withMessage('Array cannot be empty'),
    check("priority")
        .exists()
        .withMessage("Priority is Required")
        .notEmpty()
        .withMessage("Priority is Required"),
    validateRequest,
    validateToken,
    taskController.addTask
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

router.put("/edit",
    check("title")
        .notEmpty()
        .withMessage("Task Title is Required")
        .trim()
        .escape(),
    check("repeatDays")
        .exists()
        .withMessage("Days to Repeat Tasks is compulsory")
        .isArray({ min: 1 })
        .withMessage('Array cannot be empty'),
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