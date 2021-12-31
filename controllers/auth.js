const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const expressJWT = require("express-jwt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({
      error: errors.array()[0].msg,
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      error: "User not found",
    });
  }

  if (!user.authenticate(password)) {
    return res.status(400).json({
      error: "Email and password not matched",
    });
  }

  // Generate token
  const token = jwt.sign({ _id: user._id }, process.env.SECRET);

  //create cookies
  res.cookie("token", token, { expire: new Date() + 9999 });

  // send response to frontend
  const { _id, name, role } = user;

  return res.json({ token, user: { _id, name, email, role } });
};

exports.signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    });
  }

  const user = new User(req.body);

  user
    .save()
    .then((user) => {
      return res.json({
        name: user.name,
        email: user.email,
        id: user._id,
      });
    })
    .catch((err) =>
      res.status(500).json({
        error: "Data not saved in DB",
      })
    );
};

exports.signout = (req, res) => {
  res.clearCookie("token");

  res.json({
    message: "User signot successfully",
  });
};

exports.islogedin = expressJWT({
  secret: process.env.SECRET,
  userProperty: "auth",
});

// custom middleware

exports.isAuthenticated = (req, res, next) => {
  let check = req.profile._id && req.auth && req.profile._id == req.auth._id;

  if (!check) {
    return res.status(403).json({
      error: "Access Desnied",
    });
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role == 0) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }

  next();
};
