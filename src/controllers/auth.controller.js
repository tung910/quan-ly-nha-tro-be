import userModel from "~/models/user.model";
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        const existUser = await userModel.findOne({ email }).exec();
        if (existUser) {
            return res.status(400).json({
                message: "User đã tồn tại!"
            })
        }
        const user = await new userModel({ email, name, password }).save();
        res.json({
            user: {
                _id: user._id,
                email: email,
                name: name
            }
        })
    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
}

export const signin = async (res, req) => {
    const { email, name, password } = req.body;
    const user = await (await userModel.findOne({ email })).save();

    if (!user) {
        return res.status(400).json({
            message: "User không tồn tại!"
        })
    }
    if (!user.authenticate(password)) {
        return res.status(400).json({
            message: "Mật khẩu không chính xác!"
        })
    }
    const token = jwt.sign({ _id: user._id }, "datn_tw13", { expiresIn: 60 * 60 });
    return res.json({
        token,
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            role:user.role
        }
    })
}