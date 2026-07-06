import { prisma } from "../lib/prisma.js";
import { getTodayName, getTodayRange, constructDataObject } from "../utils/taskServicesHelper.js";

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

        const tasks = await prisma.task.findMany({
            where: {
                userId,
                isDeleted: false,
                taskStatus: "ACTIVE",

                OR: [
                    {
                        dueDate: {
                            gte: startOfToday,
                            lte: endOfToday,
                        },
                    },

                    {
                        AND: [
                            {
                                repeatDays: {
                                    some: {
                                        day: today,
                                    },
                                },
                            },
                            {
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
                        ],
                    },
                    {
                        AND: [
                            {
                                repeatDays: {
                                    none: {}
                                }
                            },
                            {
                                dueDate: null
                            }
                        ]
                    }
                ],
            },

            select: {
                id: true,
                title: true,
                priority: true,
                description: true,
                category: {
                    select: {
                        name: true
                    }
                },
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

export async function isTitleTaken(userId, taskId, title, categoryId) {
    const whereClause = {
        isDeleted: false,
        userId: userId,
        title: title,
        categoryId: categoryId,
        NOT: {
            id: taskId
        }
    }

    return await getTask(whereClause) != null;
}

export async function isTaskExists(userId, title, categoryId) {
    const whereClause = {
        title: title,
        isDeleted: false,
        userId: userId,
        categoryId: categoryId
    }

    return await getTask(whereClause) != null;
}

export async function isTaskExistsWithId(userId, taskId) {
    const whereClause = {
        id: taskId,
        isDeleted: false,
        userId: userId
    }

    return await getTask(whereClause) != null;
}

export async function getCategoryId(userId, taskId) {
    const task = await getTask({
        id: taskId,
        userId: userId
    })   

    return task.categoryId;
}

async function getTask(whereClause) {
    try {
        return await prisma.task.findFirst({
            where: whereClause
        })
    } catch (error) {
        throw error
    }
}

