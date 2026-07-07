import * as categoryServices from "../services/categoryServices.js"

export async function addCategory(req, res){
    try {
        if(await categoryServices.isCategoryNameTaken(req.userId, req.body.name)){
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        await categoryServices.addCategoryDB(req.userId, req.body.name);

        return res.status(200).json({
            success: true,
            message: "Category created successfully"
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Try again later"
        });
    }
}


export async function deleteCategory(req, res){
    try {
        if(!await categoryServices.isCategoryExists(req.userId, req.body.id)){
            return res.status(404).json({
                success: false,
                message: "Category does not exists"
            });
        }

        if(req.body.id == await categoryServices.getDefaultCategoryId(req.userId)){
            return res.status(422).json({
                success: false,
                message: "Deleting default category is not allowed"
            })
        }

        await categoryServices.deleteCategory(req.userId, req.body.id);

        return res.status(200).json({
            success: true,
            message: "Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Try again later"
        })
    }
}