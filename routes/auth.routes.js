const express = require("express");
const router = express.Router();
const { register, login, whoami } = require('../controllers/auth.controllers');
const { restrict } = require('../middlewares/auth.middlewares');
// Import Users
const { createUsers, getAllUsers, getDetailUsers, deleteUsers, updateUsers } = require("../handler/v1/users");
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

// Routes Url Register & Login
router.post('/register', register);
router.post('/login', login);
router.get('/whoami', restrict, whoami);

// router url users
router.post("/users", createUsers);
router.get("/users", getAllUsers);
router.get("/users/:id", getDetailUsers);
router.put("/users/:id", updateUsers);
router.delete("/users/:id", deleteUsers);

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