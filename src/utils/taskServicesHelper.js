const days = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY"
}

export function getTodayName(){
    return days[new Date().getDay()];
}


export function getTodayRange(){
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return [startOfToday, endOfToday]
}



export function constructDataObject(task){
    const data = {}
        if (task.title) {
            data.title = task.title
        }

        if (task.priority) {
            data.priority = task.priority
        }

        if (task.description) {
            data.description = task.description
        }

        if(task.status){
            data.taskStatus = task.status
        }

        if (task.repeatDays) {
            data.repeatDays = {
                deleteMany: {},
                create: task.repeatDays.map(day => {
                    return { day: day };
                })
            }
        }

        if(task.dueDate){
            data.dueDate = task.dueDate;
        }

        if(task.categoryId){
            data.categoryId = task.categoryId
        }
    return data;
}
