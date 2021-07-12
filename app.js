const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Customer = require("./models/customer");
const customerRouter = require("./routes/banking");
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
// app.use("/customers",customerRouter)

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/customers", async (req, res) => {
  const customers = await Customer.find();

  res.render("customer", { customers: customers });
});

app.use("/customers", customerRouter);

app.listen(3000, function () {
  console.log("listening to port 3000");
});
