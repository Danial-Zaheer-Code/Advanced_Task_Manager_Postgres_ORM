import { validationResult } from "express-validator";

export async function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
}


export function areValid(days){
    for(let i = 0; i < days.length; i++){
        if(!weekdays.includes(days[i])){
            return false;
        }
    }
    return true;
}

export function isValidPriority(priority){
    return priority == "LOW" || priority == "MEDIUM" || priority == "HIGH";
}