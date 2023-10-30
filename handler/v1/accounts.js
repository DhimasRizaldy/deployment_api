const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getPagination } = require("../../helpers/pagination");

// Export fungsi account
module.exports = {
  // create new accounts
  createAccounts: async (req, res, next) => {
    try {
      let { user_id, bank_name, bank_account_number, balance } = req.body;

      let newAccounts = await prisma.bank_Accounts.create({
        data: {
          user_id,
          bank_name,
          bank_account_number,
          balance,
        },
      });
      res.status(201).json({
        status: true,
        message: "Create Account Successfuly!",
        data: newAccounts,
      })
    } catch (err) {
      next(err);
    }
  },

  // get all account
  getAllAccounts: async (req, res, next) => {
    try {
      let { limit = 10, page = 1 } = req.query;
      limit = Number(limit);
      page = Number(page);

      let accounts = await prisma.bank_Accounts.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      const { _count } = await prisma.bank_Accounts.aggregate({
        _count: { id: true }
      });

      let pagination = getPagination(req, _count.id, page, limit);

      res.status(200).json({
        status: true,
        message: "OK",
        data: { pagination, accounts }
      });
    } catch (err) {
      next(err);
    }
  },

  // get accounts detail data by:id
  getDetailAccounts: async (req, res, next) => {
    try {
      let { id } = req.params;
      let accounts = await prisma.bank_Accounts.findUnique({ where: { id: Number(id) } });

      if (!accounts) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          data: 'No accounts Found With Id ' + id
        });
      }

      res.status(200).json({
        status: true,
        message: 'Detail Accounts',
        data: accounts
      });

    } catch (err) {
      next(err);
    }
  },

  // update data accounts
  updateAccounts: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { user_id, bank_name, bank_account_number, balance } = req.body;

      let updateOperation = await prisma.bank_Accounts.update({
        where: { id: Number(id) },
        data: { user_id, bank_name, bank_account_number, balance }
      });

      res.status(200).json({
        status: true,
        message: 'Updated Accounts Successfully!',
        data: updateOperation
      });

    } catch (err) {
      next(err);
    }
  },

  // delete accounts
  deleteAccounts: async (req, res, next) => {
    try {
      let { id } = req.params;

      let deleteOperation = await prisma.bank_Accounts.delete({
        where: { id: Number(id) }
      });

      res.status(200).json({
        status: true,
        message: 'Deleted Accounts Successfully!',
        data: deleteOperation
      });

    } catch (err) {
      next(err);
    }
  }
};