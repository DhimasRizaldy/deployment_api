const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

// Export fungsi profiles
module.exports = {
  // create new profiles
  createProfiles: async (req, res, next) => {
    try {
      let { user_id, identity_type, identity_number, address } = req.body;

      let newProfiles = await prisma.profiles.create({
        data: {
          user_id,
          identity_type,
          identity_number,
          address,
        },
      });
      res.status(201).json({
        status: true,
        message: "Created Profiles Successfuly!",
        data: newProfiles
      })
    } catch (err) {
      next(err);
    }
  },

  // get profiles detal by: id
  getDetailProfiles: async (req, res, next) => {
    try {
      let { id } = req.params;
      let profiles = await prisma.profiles.findUnique({
        where: { id: Number(id) }
      });

      if (!profiles) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          data: 'No Profiles Found With Id ' + id
        });
      }

      res.status(200).json({
        status: true,
        message: 'Details Profiles',
        data: profiles
      });
    } catch (err) {
      next(err);
    }
  },

  // update data profiles
  updateProfiles: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { user_id, identity_type, identity_number, address } = req.body;

      let updateOperation = await prisma.profiles.update({
        where: { id: Number(id) },
        data: {
          user_id,
          identity_type,
          identity_number,
          address
        }
      });

      res.status(200).json({
        status: true,
        message: 'Updated Profiles Successfuly!',
        data: updateOperation
      });
    } catch (err) {
      next(err);
    }
  }
}