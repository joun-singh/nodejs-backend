const express = require("express");
const route = express.Router();

const { islogedin, isAuthenticated, isAdmin } = require("../controllers/auth");
const { stripPayment } = require("../controllers/stripPayment");

route.post("/payment/stripe", stripPayment);

module.exports = route;
