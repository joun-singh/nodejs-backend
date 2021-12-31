const Category = require("../models/category");

exports.getCategoryID = (req, res, next, categoryID) => {
  Category.findById(categoryID).exec((error, category) => {
    if (error || !category) {
      return res.status(400).json({
        error: "No category found",
      });
    }

    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);

  category
    .save()
    .then((category) => {
      if (!category) {
        return res.status(400).json({
          error: "Category not created. Failed!",
        });
      }
      return res.json(category);
    })
    .catch((err) =>
      res.status(500).json({ error: "Category creation failed " + error })
    );
};

exports.getCategoryById = (req, res) => {
  res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  console.log("CATE");
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      return res.status(400).json({
        error: "No category found",
      });
    }

    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  Category.findByIdAndUpdate(
    { _id: req.category._id },
    { $set: { name: req.body.name } },
    { new: true, useFindAndModify: false },
    (err, category) => {
      if (err || !category) {
        return res.status(400).json({
          error: "Category not updated",
        });
      }

      res.json(category);
    }
  );
};

exports.deleteCategory = (req, res) => {
  console.log("poi");
  const category = req.category;
  category.remove((error, category) => {
    if (error) {
      return res.statu(400).json({ error: "Category not deleted" });
    }

    res.json({
      message: "Category deleted. successfull!",
    });
  });
  //Category.findOneAndDelete({_id:req.category._id},
};
