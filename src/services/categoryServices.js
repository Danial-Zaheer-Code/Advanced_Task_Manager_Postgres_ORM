import {prisma} from "../lib/prisma.js"


export async function addCategoryDB(userId, categoryName) {
    try {
        await prisma.category.create({
            data: {
                name: categoryName,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    } catch (error) {
        throw error
    }
}

export async function isCategoryExists(userId, categoryName){
    try {
        const category = await prisma.category.findFirst({
            where: {
                userId: userId,
                name: categoryName
            }
        })

        return category != null;
    } catch (error) {
        throw error;
    }
}


