import mongoose, { Schema } from "mongoose";
const Motel = new Schema({
    name: {
        type: String,
        minlength: 5,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    img: {
       type: String,
       required: true
    },
    desc: {
        type: String
    },
    
}, { timestamps : true})

export default mongoose.model("Motel", Motel);