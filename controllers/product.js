const Product = require("../models/product");
const fm = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const product = require("../models/product");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "No product found",
        });
      }

      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  const form = new fm.IncomingForm();

  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: "Uploaded file is damaged",
      });
    }

    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Al fields are required",
      });
    }
    let product = new Product(fields);

    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status.json({
          error: "File size is grreater that 3MB",
        });
      }
      // console.log("readStram", fs.createReadStream(files.photo.path));
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((error, product) => {
      if (error) {
        return res.status(400).json({
          error: "productnot created in Db",
        });
      }

      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;

  return res.json(req.product);
};

exports.getPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateProduct = (req, res) => {
  const form = new fm.IncomingForm();

  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: "Uploaded file is damaged",
      });
    }

    let product = req.product;

    product = _.extend(product, fields);

    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status.json({
          error: "File size is grreater that 3MB",
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((error, product) => {
      if (error) {
        return res.status(400).json({
          error: "productnot created in Db",
        });
      }

      res.json(product);
    });
  });
};

exports.deleteProduct = (req, res) => {
  let product = req.product;

  product.remove((error, deletedProduct) => {
    if (error) {
      return res.status(400).json({
        errror: "Product not deleted",
      });
    }

    return res.json({
      message: "Product deleted successfully",
      deletedProduct,
    });
  });
};

exports.getAllProduct = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortby ? req.query.sortby : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((error, products) => {
      if (error || !products) {
        return res.status(400).json({
          error: "No product found",
        });
      }

      res.json(products);
    });
};

exports.getUniqueCategory = (req, res) => {
  Product.distinct("category", {}, (error, category) => {
    if (error) {
      return res.status(400).json({
        error: "No category found",
      });
    }

    res.json(category);
  });
};

exports.updateStocks = (req, res, next) => {
  let myOperation = req.body.order.product.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { stock: -prod.count, sold: +prod.count },
      },
    };
  });

  Product.bulkWrite(myOperation, {}, (error, product) => {
    if (error) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }

    next();
  });
};
