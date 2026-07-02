import { prisma } from "../lib/prisma.js";
import { getTodayName, getTodayRange, constructDataObject } from "../utils/taskServicesHelper.js";

export async function isTaskExists(userId, title) {
    try {
        const task = await prisma.task.findFirst({
            where: {
                title: title,
                isDeleted: false,
                userId: userId
            }
        })

        return task != null;
    } catch (error) {
        throw error;
    }
}

export async function isTaskExistsWithId(userId, taskId) {
    try {
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                isDeleted: false,
                userId: userId
            }
        })

        return task != null;
    } catch (error) {
        throw error;
    }
}

export async function addTaskDB(userId, task) {
    try {
        await prisma.task.create({
            data: {
                title: task.title,
                priority: task.priority,
                description: task.description ?? "",
                dueDate: task.dueDate ?? null,
                user: {
                    connect: {
                        id: userId
                    }
                },
                repeatDays: {
                    create: task.repeatDays ? task.repeatDays.map(day => ({ day })) : []
                }
            }
        })
    } catch (error) {
        throw error;
    }
}

export async function deleteTaskDB(userId, taskId) {
    try {
        await prisma.task.update({
            where: {
                id: taskId,
                userId: userId,
                isDeleted: false
            },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        })
    } catch (error) {
        throw error;
    }
}

export async function getTodayTasksDB(userId) {
    try {
        const [startOfToday, endOfToday] = getTodayRange();

        const today = getTodayName();

        const tasks = await prisma.task.findMany({
            where: {
                userId: userId,
                isDeleted: false,
                taskStatus: "ACTIVE",
                repeatDays: {
                    some: {
                        day: today,
                    },
                },
            },
            select: {
                id: true,
                title: true,
                priority: true,
                description: true,
                completedTasks: {
                    where: {
                        completedAt: {
                            gte: startOfToday,
                            lte: endOfToday,
                        },
                    },
                    select: {
                        completedAt: true,
                    },
                },
            },
            orderBy: [
                { priority: "desc" },
                { createdAt: "desc" }
            ]
        });
        return tasks;
    } catch (error) {
        throw error;
    }
}


export async function getAllTasksDB(userId) {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                userId: userId,
                isDeleted: false
            },
            select: {
                id: true,
                title: true,
                taskStatus: true,
                priority: true,
                description: true,
                dueDate: true,
                repeatDays: {
                    select: {
                        day: true
                    }
                },
            },
            orderBy: [
                { priority: "desc" },
                { createdAt: "desc" }
            ]

        });
        return tasks;
    } catch (error) {
        throw error;
    }
}

export async function editTask(userId, task) {
    try {
        const data = constructDataObject(task);
        await prisma.task.update({
            where: {
                id: task.id,
                userId: task.userId,
                isDeleted: false
            },
            data: data
        });

    } catch (error) {
        throw error;
    }
}

export async function isTitleTaken(userId, taskId, title) {
    try {
        const task = await prisma.task.findFirst({
            where: {
                isDeleted: false,
                userId: userId,
                title: title,
                NOT: {
                    id: taskId
                }
            }
        })

        return task != null;
    } catch (error) {
        throw error;
    }
}