import * as categoryServices from "../services/categoryServices.js"

export async function addCategory(req, res){
    try {
        if(await categoryServices.isCategoryExists(req.userId, req.body.name)){
            return res.status(409).json({
                success: false,
                message: "Category Already Exists"
            });
        }

        await categoryServices.addCategoryDB(req.userId, req.body.name);

        return res.status(200).json({
            success: true,
            success: "Category Created Successfully"
        });
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            success: false,
            message: "Something went wrong. Try again later"
        });
    }
}