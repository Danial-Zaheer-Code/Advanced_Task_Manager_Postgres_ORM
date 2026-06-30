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



function isWeekdayName(str, locale = 'en-US') {
  const weekdays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2023, 0, i + 1); // Jan 1, 2023 was a Sunday
    return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date).toLowerCase();
  });

  return weekdays.includes(str.trim().toLowerCase());
}

export function areValid(days){
    for(let i = 0; i < days.length; i++){
        if(!isWeekdayName(days[i])){
            return false;
        }
    }

    return true;
}