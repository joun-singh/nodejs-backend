const { response } = require("express");
const express = require("express");

const route = express.Router();

const { islogedin, isAuthenticated, isAdmin } = require("../controllers/auth");

const {
  getCategoryID,
  getCategoryById,
  getAllCategory,
  updateCategory,
  deleteCategory,
  createCategory,
} = require("../controllers/category");

const { getUserById } = require("../controllers/user");

route.get("/category/all", getAllCategory);

route.param("userId", getUserById);

route.param("categoryID", getCategoryID);

route.post(
  "/category/create/:userId",
  islogedin,
  isAuthenticated,
  isAdmin,
  createCategory
);

route.get("/category/:categoryID", getCategoryById);

route.put(
  "/category/:categoryID/:userId",
  islogedin,
  isAuthenticated,
  isAdmin,
  updateCategory
);

route.delete(
  "/category/:categoryID/:userId",
  islogedin,
  isAuthenticated,
  isAdmin,
  deleteCategory
);

module.exports = route;
