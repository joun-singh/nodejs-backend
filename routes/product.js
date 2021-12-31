const express = require("express");
const route = express.Router();

const { islogedin, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
  getProductById,
  createProduct,
  getProduct,
  getPhoto,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getUniqueCategory,
} = require("../controllers/product");

const { getUserById } = require("../controllers/user");

route.get("/product/all", getAllProduct);

route.param("userId", getUserById);
route.param("productId", getProductById);

route.post(
  "/product/create/:userId",
  islogedin,
  isAuthenticated,
  isAdmin,
  createProduct
);

route.get("/product/:productId", getProduct);
route.get("/product/photo/:productId", getPhoto);

route.put(
  "/product/:productId/:userId",
  islogedin,
  isAuthenticated,
  isAdmin,
  updateProduct
);

route.delete(
  "/product/:productId/:userId",
  islogedin,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

route.get("/product/category", getUniqueCategory);

module.exports = route;
