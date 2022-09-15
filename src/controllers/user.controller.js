import userModel from "~/models/user.model"

export const userById = async (req, res, next, id) => {
    try {
        const user = await userModel.findById(id).exec();
        if (!user) {
            return res.status(400).json({
                message: 'không tìm thấy user!'
            })
        }
        req.profile = user;
        req.profile.password = undefined;
        req.profile.salt = undefined;

        next();

    } catch (error) {
        req.status(400).json({
            message: error
        })
    }
}