const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getPagination } = require("../../helpers/pagination");

module.exports = {
  // create new transactions
  createTransactions: async (req, res, next) => {
    try {
      let { source_account_id, destination_account_id, amount } = req.body;

      // validasi account sumber dan tujuan
      let source_account = await prisma.bank_Accounts.findUnique({
        where: {
          id: source_account_id,
        },
      });

      let destination_account = await prisma.bank_Accounts.findUnique({
        where: {
          id: destination_account_id,
        },
      });

      if (!source_account || !destination_account) {
        return res.status(400).json({
          status: false,
          message: "account destination does not exist",
          data: null,
        });
      }

      // validasi saldo akun
      if (source_account.balance < amount) {
        return res.status(400).json({
          status: false,
          message: "balance is not appropriate",
          data: null,
        });
      }

      let createTransaction = await prisma.transactions.create({
        data: {
          source_account_id,
          destination_account_id,
          amount,
        },
      });

      // update
      await prisma.bank_Accounts.update({
        where: {
          id: source_account_id,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      await prisma.bank_Accounts.update({
        where: {
          id: destination_account_id,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      res.status(200).json({
        status: true,
        message: "Transactions Successfuly!",
        data: createTransaction,
      });
    } catch (err) {
      next(err);
    }
  },

  // get all data transactions
  getAllTransactions: async (req, res, next) => {
    try {
      let { limit = 10, page = 1 } = req.query;
      limit = Number(limit);
      page = Number(page);

      let transactions = await prisma.transactions.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      const { _count } = await prisma.transactions.aggregate({
        _count: { id: true }
      });

      let pagination = getPagination(req, _count.id, page, limit);

      res.status(200).json({
        status: true,
        message: "OK",
        data: { pagination, transactions }
      });

    } catch (err) {
      next(err);
    }
  },

  // get detail data by:id
  // get detail transaksi beserta informasi pengirim dan penerima
  getDetailTransactions: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Gunakan Prisma untuk mengambil detail transaksi dan relasinya dengan akun bank pengirim dan penerima
      const transactionWithDetails = await prisma.transactions.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          source_account: {
            include: {
              user: true,
            },
          },
          destination_account: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!transactionWithDetails) {
        return res.status(404).json({
          status: false,
          message: "Transaksi Tidak Ditemukan",
          data: null,
        });
      }

      // Kembalikan hasil query sebagai respons
      res.status(200).json({
        status: true,
        message: "OK",
        data: transactionWithDetails,
      });
    } catch (err) {
      next(err);
    }
  },

}