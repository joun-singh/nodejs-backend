const express = require('express');
const route = express.Router();

const {getOrderById, createOrder, getAllOrders, getStatus, updateStatus} = require("../controllers/order");

const {getUserById, pushOrderInPurchaseList} = require("../controllers/user");
const {updateStocks} = require("../controllers/product");
const {islogedin, isAuthenticated, isAdmin} = require("../controllers/auth")

route.param("orderId", getOrderById);
route.param("userId", getUserById);

route.post("/order/create/:userId",islogedin, isAuthenticated, isAdmin,pushOrderInPurchaseList, updateStocks, createOrder)

route.get("/order/all", islogedin, isAuthenticated, isAdmin, getAllOrders)

route.get("/order/status/:userId",islogedin, isAuthenticated, isAdmin, getStatus)

route.put("/order/:orderId/status/:userId", islogedin, isAuthenticated, isAdmin, updateStatus)

module.exports = route;