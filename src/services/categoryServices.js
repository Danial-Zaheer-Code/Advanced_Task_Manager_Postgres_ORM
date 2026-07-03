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

export async function deleteCategory(userId, categoryId){
    try {
        await prisma.category.delete({
            where: {
                userId: userId,
                id: categoryId
            }
        })
    } catch (error) {
        throw error
    }
}

export async function isCategoryExists(userId, categoryName){
    const whereCaluse = {
        userId: userId,
        name: categoryName
    }

    return await getCategory(whereCaluse) != null
}

export async function isCategoryExistsWithId(userId, categoryId){
        const whereCaluse = {
        userId: userId,
        id: categoryId
    }

    return await getCategory(whereCaluse) != null

} 

export async function getDefaultCategoryId(userId){
    const category = await getCategory({
        name: "Tasks"
    })

    return category.id;
}

async function getCategory(whereClause){
    try {
        const category = await prisma.category.findFirst({
            where: whereClause
        })
        return category;
    } catch (error) {
        throw error;
    }
} 