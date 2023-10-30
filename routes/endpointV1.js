const express = require("express");
const router = express.Router();
// Import Users
const { createUsers, getAllUsers, getDetailUsers, deleteUsers, updateUsers } = require("../handler/v1/users");
// Import Profiles
const { createProfiles, getDetailProfiles, updateProfiles } = require("../handler/v1/profiles");
// Import Accounts
const { createAccounts, getAllAccounts, getDetailAccounts, deleteAccounts, updateAccounts } = require("../handler/v1/accounts");
// Import Transactions
const { createTransactions, getAllTransactions, getDetailTransactions } = require("../handler/v1/transactions");

// router main url
router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: " Welcome to learn Restful APIs - Challange Chapter 4",
    data: null,
  });
});

// router url users
router.post("/users", createUsers);
router.get("/users", getAllUsers);
router.get("/users/:id", getDetailUsers);
router.put("/users/:id", updateUsers);
router.delete("/users/:id", deleteUsers);

// router url profiles
router.post("/profiles", createProfiles);
router.get("/profiles/:id", getDetailProfiles);
router.put("/profiles/:id", updateProfiles);


// router url accounts
router.post("/accounts", createAccounts);
router.get("/accounts", getAllAccounts);
router.get("/accounts/:id", getDetailAccounts);
router.put("/accounts/:id", updateAccounts);
router.delete("/accounts/:id", deleteAccounts);

// router url transactions
router.post("/transactions", createTransactions);
router.get("/transactions", getAllTransactions);
router.get("/transactions/:id", getDetailTransactions);

// exports router
module.exports = router;