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

const weekdays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2023, 0, i + 1); // Jan 1, 2023 was a Sunday
    return new Intl.DateTimeFormat("en-US", { weekday: 'long' }).format(date).toUpperCase();
});

export function areValid(days) {
    for (let i = 0; i < days.length; i++) {
        if (!weekdays.includes(days[i])) {
            return false;
        }
    }
    return true;
}

export function isValidPriority(priority) {
    return priority == "LOW" || priority == "MEDIUM" || priority == "HIGH";
}

export function isValidStatus(status) {
    return status == "ACTIVE" || status == "INACTIVE"
}


export function isValidDueDate(dueDate) {
    return dueDate.getTime() >= new Date().getTime();
}