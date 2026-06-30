import { prisma } from "../lib/prisma.js";


export async function addUser(user) {
	try {
		await prisma.user.create({
			data: {
				email: user.email,
				password: user.password,
				name: user.name,
				phone: user.phone,
				password: user.password
			}
		})
	} catch (error) {
		throw error;
	}
}

export async function getUser(email) {
	try {
		const user = await prisma.user.findUnique({
			where: {email:email}
		})
		return user;
	} catch (error) {
		throw error;
	}
}

export async function getUserById(id) {
	try {
		const user = await prisma.user.findUnique({
			where: {id:id}
		})
		return user;
	} catch (error) {
		throw error;
	}
}


export async function isPhoneNumberExist(phoneNumber){
	const user = await prisma.user.findUnique({
		where: {phone: phoneNumber}
	})

	return user != null;
}