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
    const whereCaluse = {
        userId: userId,
        name: categoryName
    }

    return await getCategory(whereCaluse) != null
}

export async function deleteCategory(userId, categoryId){

}


export async function isCategoryExistsWithId(userId, categoryId){
        const whereCaluse = {
        userId: userId,
        id: categoryId
    }

    return await getCategory(whereCaluse) != null

} 


async function getCategory(whereClause){
    try {
        const category = await prisma.category.findFirst({
            where: whereClause
        })
        console.log(category);
        return category;
    } catch (error) {
        throw error;
    }
} 