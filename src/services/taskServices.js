// import { connectionPool } from "../config/dbConfig.js";

// export async function addTaskDB(userId, task) {
//     try {
//         const [result] = await connectionPool.query(`
// 			INSERT INTO tasks (title, user_id, task_status)
// 			VALUES (?, ?, ?);
// 			`, [task.title, userId, 'active']);
        

//         const taskId = result.insertId;

//         const repeatDays = task.repeatDays.map(day => [taskId,day]);
//         return await connectionPool.query(`
//             INSERT INTO tasks_repeat(task_id, day_repeat)
//             VALUES ?
//             `, [repeatDays]);

//     } catch (error) {
//         throw error;
//     }
// }

// export async function changeStatusDB(id, status) {
//     try {
//         const [result] = await connectionPool.query(`
//         UPDATE tasks
//         SET task_status=?
//         WHERE id=?
//         AND task_status <> ?
//         `, [status, id, status]);
//         return result.affectedRows == 1;

//     } catch (error) {
//         throw error;
//     }
// }

// export async function deleteTaskDB(id) {
//     try {
//         const [result] = await connectionPool.query(`
//         UPDATE tasks
//         SET is_deleted=1,
//         deleted_at=CURRENT_TIMESTAMP
//         WHERE id=?
//         `, [id]);
//         return result.affectedRows == 1;
//     } catch (error) {
//         throw error;
//     }
// }

// export async function isTaskExists(title) {
//     try {
//         const [result] = await connectionPool.query(`
//         SELECT * FROM tasks WHERE title=? AND is_deleted=0;
//         `, [title]);

//         return result.length == 1; 
//     } catch (error) {
//         throw error;
//     }
// }

// export async function isTaskExistsWithId(id) {
//     try {
//         const [result] =  await connectionPool.query(`
//         SELECT * FROM tasks WHERE id=? AND is_deleted=0;
//         `, [id]);
//         return result.length == 1; 
//     } catch (error) {
//         throw error;
//     }
// }

// export async function getTodayTasksDB(userId) {
//     try {
//         const [result] = await connectionPool.query(`
//             SELECT t.id, t.title,
//             EXISTS (
//                 SELECT 1
//                 FROM tasks_completed c
//                 WHERE c.task_id = t.id
//                 AND CURDATE() = DATE(c.completion_date)
//             ) AS is_completed
//             FROM tasks t
//             INNER JOIN tasks_repeat r
//             ON t.id = r.task_id
//             WHERE t.user_id = ?
//             AND t.task_status = 'active'
//             AND t.is_deleted = 0
//             AND r.day_repeat = DAYNAME(CURDATE())
//             ;
//             `, [userId])
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

// export async function getCompletedTasksDB(userId) {
//     try {
//         const [result] = await connectionPool.query(`
//             SELECT t.id, t.title, DATE(c.completion_date) as completion_date
//             FROM tasks t
//             INNER JOIN tasks_completed c ON t.id = c.task_id
//             WHERE t.user_id = ? 
//             AND t.is_deleted = 0;
//             `, [userId])
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

// export async function markCompletedDB(id){
//     try {
//         const [result] = await connectionPool.query(`
//             INSERT IGNORE INTO tasks_completed(task_id)
//             VALUES(?)
//             `,[id]);
//         return result.affectedRows == 1;
//     } catch (error) {
//         throw error;
//     }
// }

// export async function isCompletedToday(id){
//     try{
//         const [result] = await connectionPool.query(`
//             SELECT * FROM tasks_completed
//             WHERE task_id = ?
//             AND DATE(completion_date) = CURDATE();
//         `, [id]);

//         return result.length == 1;
//     } catch(error){
//         throw error;
//     }
// }

// export async function getAllTasksDB(userId) {
//     try {
//         const [result] = await connectionPool.query(`
//             SELECT t.id, t.title, t.task_status, GROUP_CONCAT(r.day_repeat) repeat_days
//             FROM tasks t
//             LEFT JOIN tasks_repeat r ON t.id = r.task_id
//             WHERE t.is_deleted = 0
//             GROUP BY t.id;
//         `);

//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

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