import bcrypt from 'bcrypt'

const saltRounds = 10;

export async function hash(password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export async function compare(inputPassword, storedHashedPassword) {
	return await bcrypt.compare(inputPassword, storedHashedPassword);
}


export function convertToUpperCase(strings){
    return strings.map(str => str.trim().toUpperCase());
}






const weekdays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2023, 0, i + 1); // Jan 1, 2023 was a Sunday
    return new Intl.DateTimeFormat("en-US", { weekday: 'long' }).format(date).toUpperCase();
  });

export function areValid(days){
    for(let i = 0; i < days.length; i++){
        if(!weekdays.includes(days[i])){
            return false;
        }
    }
    return true;
}

export function isValidPriority(priority){
    return priority == "LOW" || priority == "MEDIUM" || priority == "HIGH";
}

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