const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  // console.log("ID", id);
  const user = User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User not fount",
      });
    }

    req.profile = user;
  });
  next();
};

exports.getUser = (req, res) => {
  // req.profile.salt = undefined;
  // req.profile.encry_password = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (error, user) => {
      if (error) {
        return res.status(400).json({ message: "updation failed" });
      }

      res.json(user);
    }
  );
};

exports.userOrderList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No order found to this account",
        });

        return res.json(order);
      }
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];

  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.chategory,
      quantity: product.quantity,
      amount: req.body.order.amout,
      transaction_id: req.body.transaction_id,
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true, useFindAndModify: false },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to save purchases",
        });

        // req.purchases = purchases;D
      }
    }
  );

  next();
};
