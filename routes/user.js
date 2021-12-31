const express  = require('express');

const  route = express.Router();
const { getUserById, getUser, updateUser, userOrderList } = require('../controllers/user');
const {islogedin, isAuthenticated} = require("../controllers/auth")
route.param("userId", getUserById);

route.get("/user/:userId",islogedin, isAuthenticated ,getUser);

route.put("/user/:userId", islogedin, isAuthenticated ,updateUser)
route.post("orders/user/:userId", islogedin, isAuthenticated ,userOrderList)


module.exports = route;