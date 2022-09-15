import motel from "../models/motel.model";
import Motel from "../models/motel.model";

export const create = async (req, res) => {
    try {
        const motel = await new Motel(req.body).save();
        res.json(motel)
    } catch (error) {
        res.status(400).json({
            error: "Khong them duoc nha tro"
        })
    }
}

export const list = async (req, res) => {
    try {
        const motel = await Motel.find({}).exec();
        res.json(motel)
    } catch (error) {
        res.status(400).json({
            error: "Khong co nha tro"
        })
    }
}

export const get = async (req, res) => {
    try {
        const model = await Motel.findOne({_id: req.params.id}).exec();
        res.json(motel)
    } catch (error) {
        res.status(400).json({
            error: "Khong co thong tin nha tro"
        })
    }
}

export const remove = async (req, res) => {
    try {
        const model = await Motel.findByIdAndRemove({_id: req.params.id}).exec();
        res.json(model)
    } catch (error) {
        res.status(400).json({
            error: "Khong xoa duoc nha tro"
        })
    }
}

export const update = async (req, res) => {
    const condition = { id: req.params.id }
    const update = req.body
    try {
        const model = await Motel.findOneAndUpdate(condition, update).exec();
        res.json(model)
    } catch (error) {
        res.status(400).json({
            error: "Khong sua duoc nha tro"
        })
    }
}