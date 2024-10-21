'use strict';
const { User } = require('../models');

const { steps, fullPhone, hashPassword, comparePassword } = require('../services/authService')


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await User.bulkCreate([
      {
        name: "GenZ Team",
        phone: "0909093060",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093060.jpg",
        email: "admin@genz.com",
        status: 'active',
        role: "admin"
      },
      {
        name: "Hoàng Lê",
        phone: "0909093061",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093061.jpg",
        email: "hoangle@genz.com",
        status: 'active',
        role: "donor"
      },
      {
        name: "Ninh Võ",
        phone: "0909093062",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093062.jpg",
        email: "ninvo@genz.com",
        status: 'active',
        role: "charity"
      },
      {
        name: "Tín Nguyễn",
        phone: "0909093063",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093063.jpg",
        email: "tinnguyen@genz.com",
        status: 'pending',
        role: "charity"
      },
      {
        name: "Vương Nguyễn",
        phone: "0909093064",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093064.jpg",
        email: "vuongnguyen@genz.com",
        status: 'active',
        role: "recipient"
      },
      {
        name: "Ninh Võ 1",
        phone: "0909093065",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093062.jpg",
        email: "ninvo1@genz.com",
        status: 'active',
        role: "charity"
      },
      {
        name: "Ninh Võ 2",
        phone: "0909093066",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093062.jpg",
        email: "ninvo2@genz.com",
        status: 'active',
        role: "charity"
      },
      {
        name: "Ninh Võ 3",
        phone: "0909093067",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093062.jpg",
        email: "ninvo3@genz.com",
        status: 'active',
        role: "charity"
      },
      {
        name: "Ninh Võ 4",
        phone: "0909093068",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093062.jpg",
        email: "ninvo4@genz.com",
        status: 'active',
        role: "charity"
      },
      {
        name: "Ninh Võ 5",
        phone: "0909093069",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093062.jpg",
        email: "ninvo5@genz.com",
        status: 'active',
        role: "charity"
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await User.destroy({ where: {}, truncate: true });
  }
};
