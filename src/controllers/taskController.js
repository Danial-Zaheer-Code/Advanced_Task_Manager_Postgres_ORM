import * as taskServices from "../services/taskServices.js"
import * as completedTaskServices from "../services/completedTaskServices.js"
import { convertToUpperCase, areValid } from "../utils/utils.js";
export async function addTask(req, res) {
    try {
        const userId = req.userId;
        const task = req.body;
        if (await taskServices.isTaskExists(req.userId, task.title)) {
            return res.status(409).json({
                success: false,
                message: "Task already exists"
            });
        }

        task.repeatDays = convertToUpperCase(task.repeatDays);
        if(!areValid(task.repeatDays)){
            return res.status(400).json({
                success: false,
                message: "Invalid weekdays"
            });
        }

        await taskServices.addTaskDB(userId, task);
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
        if(!await taskServices.isTaskExistsWithId(req.userId, req.body.id)){
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

export async function getTodayTasks(req, res){
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

export async function getCompletedTasks(req, res){
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

export async function markCompleted(req, res){
    try {
        if(!await taskServices.isTaskExistsWithId(req.userId,req.body.id)){
            return res.status(409).json({
                success: false,
                message: "Task does not exist"
            });
        }

        if(!await completedTaskServices.isDueToday(req.userId, req.body.id)){
            return res.status(409).json({
                success: false,
                message: "Not Due Today"
            })
        }

        if(await completedTaskServices.isCompletedToday(req.userId, req.body.id)){
            return res.status(409).json({
                success: false,
                message: "Already Completed"
        })
        }
        await completedTaskServices.markCompletedDB(req.body.id);
        res.status(200).json({
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

// export async function getAllTasks(req,res) {
//     try {
//         const allTasks = await taskServices.getAllTasksDB(req.userId);
//         res.status(200).json({
//                 success: true,
//                 allTasks: allTasks
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//                 success: false,
//                 message: "Something went wrong. Try again later"
//         });
//     }
// }


// export async function editTask(req, res) {
//     try {
//         const task = req.body;
//         const isExist = await taskServices.isTaskExistsWithId(task.id) 
//         if (!isExist) {
//             return res.status(408).json({
//                 success: false,
//                 message: "Task does not exist"
//             });
//         }

//         if(await taskServices.isTitleTaken(task.id, task.title)){
//             res.status(409).json({
//                 success: false,
//                 message: "New Title Already Taken"
//             })
//         }
//         if(!areValid(task.repeatDays)){
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Weekdays"
//             });
//         }

//         await taskServices.editTask(task);
//         return res.status(200).json({
//                 success: true,
//                 message: "Edited Successfully"
//             });
        
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//                 success: false,
//                 message: "Something went wrong. Try again later"
//         });    
//     }
// }


// export async function changeStatus(req, res) {
//     try {
//         const status = req.body.status.toLowerCase();

//         if(status != "active" && status != "inactive"){
//             res.status(400).json({
//                 success: false,
//                 message: "Wrong status"
//             });
//         }

//         const isExist = await taskServices.isTaskExistsWithId(req.body.id) 
//         if (!isExist) {
//             return res.status(409).json({
//                 success: false,
//                 message: "Task Does not Exist"
//             });
//         }

//         const hasChanged = await taskServices.changeStatusDB(req.body.id, status);

//         if(!hasChanged){
//             return res.status(200).json({
//                 success: true,
//                 message: `Status is alrady ${status}`
//             })
//         }

//         return res.status(200).json({
//                 success: true,
//                 message: "Task Status updated successfully"
//             });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//                 success: false,
//                 message: "Something went wrong. Try again later"
//         });
//     }
// }
