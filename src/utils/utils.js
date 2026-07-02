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

