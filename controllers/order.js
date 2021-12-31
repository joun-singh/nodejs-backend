const Order = require("../models/order");

exports.getOrderById = (req, res, next) => {
    Order.find()
        .populate("user", "_id name")
        .exec((error, order) => {
            if(error){
                return res.status(400).json({
                    error:"No order found"
                })
            }

            req.order= order
        })
}

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body);

    order.save((error, order) => {
        if(error){
            res.status(400).json({
                error: "Order not saved"
            })
        }

        res.json(order);
    })
}

exports.getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name")
        .exec((error, order) => {
            if(error){
                res.status(400).json({
                    error: "No order found",
                })


            }
            res.json(order);
        })
}

exports.getStatus = (req, res) => {
    res.json(Order.Schema.path("status").enumValues)
}

exports.updateStatus = (req, res) => {
    Order.update(
        {_id : req.body.orderId},
        {$set : {status: req.body.status}},
        (error, order)=>{
            if(error){
                res.status(400).json({
                    error: "Staus updation failed",
                })
            }
            res.json(order);
        }
    )
}