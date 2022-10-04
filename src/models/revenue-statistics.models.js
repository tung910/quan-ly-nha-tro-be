const mongoose = require('mongoose')

const RevenueStatisticsSchema = new mongoose.Schema({
    totalAmount:{
      type:Number,
      require:true
    },
    month:{
      type:String,
      require:true
    }
},{timestamps:true})