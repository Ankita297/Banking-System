const express = require("express");

const router = express.Router();

const Customer = require("../models/customer");

// add new customer
router.get("/new", (req, res) => {
  console.log(req.body);
  res.render("new");
});

router.post("/new", async (req, res) => {
  let customer = new Customer({
    accountNumber: req.body.accountNumber,
    customerName: req.body.customerName,
    emailId: req.body.emailId,
    currentBalance: req.body.currentBalance,
  });
  try {
    customer = await customer.save();
    res.redirect("/customers/allCustomers");
  } catch (err) {
    res.render("failure");
  }
});

// get all customers list
router.get("/allCustomers", async (req, res) => {
  const customers = await Customer.find();

  res.render("customer", { customers: customers });
});

// deposit money

router.get("/deposit", async (req, res) => {
  const customers = await Customer.find();

  res.render("depositmoney", { customers: customers });
});
router.post("/deposit", async (req, res) => {
  const accountNo = req.body.accountNumber;
  const money = req.body.amount;

  let foundCustomer;
  try {
    foundCustomer = await Customer.findOne({ accountNumber: accountNo });
  } catch (err) {
    console.log(err);
  }
  if (!foundCustomer) {
    res.render("failure");
  }

  Customer.findOneAndUpdate(
    { accountNumber: accountNo },
    { $inc: { currentBalance: money } }
  )
    .then(function () {
      res.render("success");
    })
    .catch(function (err) {
      consol.log(err);
    });
});

//withdraw money
router.get("/withdraw", async (req, res) => {
  const customers = await Customer.find();

  res.render("withdrawmoney", { customers: customers });
});

router.post("/withdraw", async (req, res) => {
  const accountNo = req.body.accountNumber;
  const money = req.body.amount;

  let foundCustomer;
  try {
    foundCustomer = await Customer.findOne({ accountNumber: accountNo });
  } catch (err) {
    console.log(err);
  }
  if (!foundCustomer) {
    res.render("failure");
  }
  Customer.findOneAndUpdate(
    { accountNumber: accountNo },
    { $inc: { currentBalance: -money } }
  )
    .then(function () {
    //   console.log("money deposit success");
      res.render("success");
    })
    .catch(function (err) {
      console.log(err);
    });
});

// transfer money

router.get("/transfer", async (req, res) => {
  const customers = await Customer.find();

  res.render("transfer", { customers: customers });
});

router.post("/transfer", async (req, res) => {
  const from = req.body.from;
  const to = req.body.to;
  const amount = req.body.amount;
  let fromCustomer;
  let toCustomer;
  try {
    fromCustomer = await Customer.findOne({ accountNumber: from });
    toCustomer = await Customer.findOne({ accountNumber: to });
  } catch (err) {
    console.log(err);
  }
  if (!fromCustomer || !toCustomer) {
    res.render("failure");
  } else {
    Customer.findOneAndUpdate(
      { accountNumber: from },
      { $inc: { currentBalance: -amount } },
      (err, res) => {
        if (err) {
          res.render("failure");
        }
        Customer.findOneAndUpdate(
          { accountNumber: to },
          { $inc: { currentBalance: amount } },
          (err, res) => {
            if (err) {
              res.render("failure");
            }
          }
        );
      }
    );

    res.render("success");
  }
});
module.exports = router;
