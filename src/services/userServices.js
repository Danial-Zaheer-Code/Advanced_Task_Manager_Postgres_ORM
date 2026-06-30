import { connectionPool } from "../config/dbConfig.js";


export async function addUser(user) {
	try {
		const [result] = await connectionPool.query(`
			INSERT INTO users (email, name, pass, phone)
			VALUES (?, ?, ?, ?);
			`, [user.email, user.name, user.password, user.phone]);

		return result;

	} catch (error) {
		throw error;
	}
}

export async function getUser(email) {
	try {
		const [rows] = await connectionPool.query(`
			SELECT id, email, name, pass as password, phone as phoneNumber 
			FROM users
			WHERE email=?;
			`,[email]);

		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		throw error;
	}
}

export async function getUserById(id) {
	try {
		const [rows] = await connectionPool.query(`
			SELECT id, email, name, pass as password, phone as phoneNumber
			FROM users
			WHERE id=?;
			`, [id]);

		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		throw error;
	}
}


export async function isPhoneNumberExist(phoneNumber){
	const [result] = await connectionPool.query(`
		SELECT phone
		FROM users
		WHERE phone=?
	`,[phoneNumber]);

	return result.length > 0;
}