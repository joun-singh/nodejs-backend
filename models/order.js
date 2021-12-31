const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema;

const productCartShema = new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product"
    },
    name:{
        type:String
    },
    count:{type:Number},
    price:{type:Number}
})

const orderShema = new mongoose.Schema({
    products: [productCartShema],
    transaction_id:{},
    amount:{type:Number},
    address:String,
    update:Date,
    status:{
        type: String,
        default: "recieved",
        enum : ["cancelled, delivered, shipped, recieved"]
    },
    user:{
        type:ObjectId,
        ref:"User"
    }
},{timestamps:true})

const Order = mongoose.model("Order",orderShema);
const ProductCartShema = mongoose.model("ProductCartShema",productCartShema);

module.exports = {Order,ProductCartShema}
