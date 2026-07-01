import { prisma } from "../lib/prisma.js";
import { getTodayName, getTodayRange } from "../utils/utils.js";

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
                user: {
                    connect: {
                        id: userId
                    }
                },
                repeatDays: {
                    create: task.repeatDays.map(day => ({ day }))
                }
            }
        })
    } catch (error) {
        throw error;
    }
}

export async function deleteTaskDB(userId, taskId) {
    try {
        await prisma.task.delete({
            where: {
                id: taskId,
                userId: userId,
                isDeleted: false
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
                repeatDays: {
                    select: {
                        day: true
                    }
                },
            },
        });
        return tasks;
    } catch (error) {
        throw error;
    }
}


export async function changeStatusDB(taskId, status) {
    try {
        console.log(taskId, status);
        const updatedtasks = await prisma.task.updateMany({
            where: {
                id: taskId,
                isDeleted: false,
                NOT : {
                    taskStatus: status
                }
            },
            data: {
                taskStatus: status
            }
        })

        return updatedtasks.count > 0;
    } catch (error) {
        throw error;
    }
}

// export async function editTask(task){
//     try {
//         await connectionPool.query(`
//             UPDATE tasks
//             SET title=?
//             WHERE id=?
//         `,[task.title, task.id]);

//         await connectionPool.query(`
//             DELETE FROM tasks_repeat
//             WHERE task_id = ?
//         `, [task.id]);

//         const repeatDays = task.repeatDays.map(day => [task.id,day]);
//         return await connectionPool.query(`
//             INSERT INTO tasks_repeat(task_id, day_repeat)
//             VALUES ?
//         `, [repeatDays]);

//     } catch (error) {
//         throw error;
//     }
// }

// export async function isTitleTaken(id, title){
//     const [result] = await connectionPool.query(`
//         SELECT * FROM tasks
//         WHERE title=?
//         AND id<>?
//         AND is_deleted=0;
//     `,[title, id])
//     return result.length > 0;
// }