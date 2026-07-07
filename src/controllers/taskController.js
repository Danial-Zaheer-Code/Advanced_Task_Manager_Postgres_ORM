import * as taskServices from "../services/taskServices.js"
import * as completedTaskServices from "../services/completedTaskServices.js"
import * as categoryServices from "../services/categoryServices.js"
export async function addTask(req, res) {
    try {
        const task = req.body;

        if (!task.categoryId) {
            task.categoryId = await categoryServices.getDefaultCategoryId(req.userId)
        }
        else if (!await categoryServices.isCategoryExists(req.userId, task.categoryId)) {
            return res.status(404).json({
                success: false,
                message: "Category Not Found"
            })
        }

        await taskServices.addTaskDB(req.userId, task);
        return res.status(201).json({
            success: true,
            message: "Task created successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Try again later"
        });
    }
}

export async function deleteTask(req, res) {
    try {
        if (!await taskServices.isTaskExists(req.userId, req.body.id)) {
            return res.status(409).json({
                success: false,
                message: "Task does not exists"
            });
        }

        await taskServices.deleteTaskDB(req.userId, req.body.id);
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Try again later"
        });
    }
}

export async function getTodayTasks(req, res) {
    try {
        let tasks = await taskServices.getTodayTasksDB(req.userId);
        tasks = tasks.map(task => {
            task.isCompleted = task.completedTasks.length != 0;
            delete task.completedTasks;
            return task;
        })
        res.status(200).json({
            success: true,
            tasks: tasks
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Try again later"
        });
    }
}

export async function getCompletedTasks(req, res) {
    try {
        const completedTasks = await completedTaskServices.getCompletedTasksDB(req.userId);

        res.status(200).json({
            success: true,
            completedTasks: completedTasks
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Try again later"
        });
    }
}

export async function markCompleted(req, res) {
    try {
        if (!await taskServices.isTaskExists(req.userId, req.body.id)) {
            return res.status(409).json({
                success: false,
                message: "Task does not exist"
            });
        }

        if (!await taskServices.isDueToday(req.userId, req.body.id)) {
            return res.status(409).json({
                success: false,
                message: "Not Due Today"
            })
        }

        if (await completedTaskServices.isCompletedToday(req.userId, req.body.id)) {
            return res.status(409).json({
                success: false,
                message: "Already Completed"
            })
        }
        await completedTaskServices.markCompletedDB(req.body.id);

        if(!await taskServices.canRepeat(req.userId, req.body.id)){
            await taskServices.deleteTaskDB(req.userId, req.body.id)
        }

        return res.status(200).json({
            success: true,
            message: "Marked Completed Successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Try again later"
        });
    }
}

export async function getAllTasks(req, res) {
    try {
        const allTasks = await taskServices.getAllTasksDB(req.userId);
        res.status(200).json({
            success: true,
            allTasks: allTasks
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Try again later"
        });
    }
}


export async function editTask(req, res) {
    try {
        const task = req.body;

        if (!await taskServices.isTaskExists(req.userId, task.id)) {
            return res.status(408).json({
                success: false,
                message: "Task does not exist"
            });
        }

        await taskServices.editTask(req.userId, task);
        return res.status(200).json({
            success: true,
            message: "Edited Successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Try again later"
        });
    }
}
