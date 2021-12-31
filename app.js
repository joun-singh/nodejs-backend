const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const stripPayment = require("./routes/stripPayment");

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DATABASE CONNECTED"))
  .catch((err) => console.log("DATABASE SERVER NOT RUNNING"));

const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", categoryRoute);
app.use("/api", productRoute);
app.use("/api", orderRoute);
app.use("/api", stripPayment);

app.get("/", (req, res) => {
  return res.send("Home page");
});

app.listen(port, () => console.log("app is up and running"));
