import { prisma } from "../lib/prisma.js";
import { getTodayName, getTodayRange, processTaskEditObject } from "../utils/taskServicesHelper.js";

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
                category: {
                    connect: {
                        id: task.categoryId
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

        const todayRange = {
            gte: startOfToday,
            lte: endOfToday,
        };

        const tasks = await prisma.task.findMany({
            where: {
                userId,
                isDeleted: false,
                taskStatus: "ACTIVE",

                OR: [
                    {
                        dueDate: todayRange,
                    },

                    {
                        repeatDays: {
                            some: {
                                day: today,
                            },
                        },
                        OR: [
                            {
                                dueDate: null,
                            },
                            {
                                dueDate: {
                                    lte: endOfToday,
                                },
                            },
                        ],
                    },

                    {
                        repeatDays: {
                            none: {},
                        },
                        dueDate: null,
                    },
                ],
            },

            select: {
                id: true,
                title: true,
                priority: true,
                description: true,

                category: {
                    select: {
                        name: true,
                    },
                },

                completedTasks: {
                    where: {
                        completedAt: todayRange,
                    },
                    select: {
                        completedAt: true,
                    },
                },
            },

            orderBy: [
                { priority: "desc" },
                { createdAt: "desc" },
            ],
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
                category: {
                    select: {
                        name: true
                    }
                },
                repeatDays: {
                    select: {
                        day: true
                    }
                },
            },
            orderBy: [
                { priority: "desc" },
                { createdAt: "desc" }
            ],


        });
        return tasks;
    } catch (error) {
        throw error;
    }
}

export async function editTask(userId, task) {
    try {
        task.data = processTaskEditObject(task.data);
        await prisma.task.update({
            where: {
                id: task.id,
                userId: userId,
                isDeleted: false
            },
            data: task.data
        });

    } catch (error) {
        throw error;
    }
}

export async function isTaskExists(userId, taskId) {
    const whereClause = {
        id: taskId,
        isDeleted: false,
        userId: userId
    }

    const tasks = await getTasks(whereClause);

    return tasks.length != 0;
}

export async function canRepeat(userId, taskId) {
    const whereClause = {
        id: taskId,
        userId: userId,
        isDeleted: false,
        repeatDays: {
            some: {}
        }
    }

    const tasks = await getTasks(whereClause)
    return tasks.length != 0
}

async function getTasks(whereClause) {
    try {
        return await prisma.task.findMany({
            where: whereClause
        })
    } catch (error) {
        throw error
    }
}

export async function isDueToday(userId, taskId) {
    try {
        const today = getTodayName();

        const [startOfToday, endOfToday] = getTodayRange()
        const todayRange = {
            gte: startOfToday,
            lte: endOfToday,
        };

        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId,
                isDeleted: false,
                taskStatus: "ACTIVE",

                OR: [
                    {
                        repeatDays: {
                            some: {
                                day: today,
                            },
                        },
                        OR: [
                            {
                                dueDate: {
                                    lte: endOfToday,
                                },
                            },
                            {
                                dueDate: null,
                            },
                        ],
                    },

                    {
                        dueDate: todayRange,
                    },

                    {
                        dueDate: null,
                        repeatDays: {
                            none: {},
                        },
                    },
                ],
            },
        });
        return task != null;
    } catch (error) {
        throw error;
    }
}