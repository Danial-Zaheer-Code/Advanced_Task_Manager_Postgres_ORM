import { prisma } from "../lib/prisma.js";
import { getTodayName, getTodayRange } from "../utils/taskServicesHelper.js";

export async function getCompletedTasksDB(userId) {
    try {
        const tasks = await prisma.completedTask.findMany({
            where: {
                task: {
                    userId: userId
                }
            },
            select: {
                task: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        category: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                completedAt: true,
            },
            orderBy: [
                {
                    task: {
                        priority: "desc"
                    }
                },
                { completedAt: "desc" },
            ]

        })
        return tasks;
    } catch (error) {
        throw error;
    }
}


export async function isDueToday(userId, taskId) {
    try {
        const today = getTodayName();

        const [startOfToday, endOfToday] = getTodayRange()
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId: userId,
                isDeleted: false,
                taskStatus: "ACTIVE",
                OR: [
                    {
                        repeatDays: {
                            some: {
                                day: today,
                            },
                        },
                    },
                    {
                        dueDate: {
                            gte: startOfToday,
                            lte: endOfToday
                        }
                    }
                ]
            }
        });
        return task != null;
    } catch (error) {
        throw error;
    }
}

export async function isCompletedToday(userId, taskId) {
    try {
        const [startOfToday, endOfToday] = getTodayRange();
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId: userId,
                isDeleted: false,
                completedTasks: {
                    some: {
                        completedAt: {
                            gte: startOfToday,
                            lte: endOfToday,
                        }
                    }
                }
            }
        })

        return task != null;
    } catch (error) {
        throw error;
    }
}

export async function markCompletedDB(taskId) {
    try {
        const row = await prisma.completedTask.create({
            data: {
                task: {
                    connect: {
                        id: taskId
                    }
                }
            }
        });
    } catch (error) {
        throw error;
    }
}
