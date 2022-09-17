const mongoose = require('mongoose');
const MotelSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Motel', MotelSchema);