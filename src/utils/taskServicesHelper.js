const days = {
    0: "SUNDAY",
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY"
}

export function getTodayName() {
    return days[new Date().getDay()];
}


export function getTodayRange() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return [startOfToday, endOfToday]
}



export function processTaskEditObject(data) {
    if(!data.repeatDays){
        return data;
    }

    data.repeatDays = {
        deleteMany: {},
        create: data.repeatDays.map(day => {
            return { day: day };
        })
    }

    return data;
}
