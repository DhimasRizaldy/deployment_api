const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  register: async (req, res, next) => {
    try {
      let { name, email, password, password_confirmation } = req.body;
      if (password != password_confirmation) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'please ensure that the password and password confirmation match!',
          data: null
        });
      }

      let usersExist = await prisma.users.findUnique({ where: { email } });
      if (usersExist) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'users has already been used!',
          data: null
        });
      }

      let encryptedPassword = await bcrypt.hash(password, 10);
      let users = await prisma.users.create({
        data: {
          name,
          email,
          password: encryptedPassword
        }
      });

      return res.status(201).json({
        status: true,
        message: 'Created',
        err: null,
        data: { users }
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      let { email, password } = req.body;

      let users = await prisma.users.findUnique({ where: { email } });
      if (!users) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'invalid email or password!',
          data: null
        });
      }

      let isPasswordCorrect = await bcrypt.compare(password, users.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'invalid email or password!',
          data: null
        });
      }

      let token = jwt.sign({ id: users.id }, JWT_SECRET_KEY);

      return res.status(200).json({
        status: true,
        message: 'OK',
        err: null,
        data: { users, token }
      });
    } catch (err) {
      next(err);

    }
  },

  whoami: (req, res, next) => {
    return res.status(200).json({
      status: true,
      message: 'OK',
      err: null,
      data: { users: req.users }
    });
  }
};