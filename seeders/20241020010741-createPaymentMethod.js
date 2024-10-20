'use strict';
const { PaymentMethod } = require('../models');

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
    await PaymentMethod.bulkCreate([
      {
        code: "ZALOAPP",
        name: "Zalo App",
        type: "online",
      },
      {
        code: "MASTERCARD",
        name: "Thẻ ViSa/Master",
        type: "online",
      },
      {
        code: "ATM",
        name: "Thẻ ATM",
        type: "online",
      },
      {
        code: "CASH",
        name: "Tiền Mặt",
        type: "offline",
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await PaymentMethod.destroy({ where: {}, truncate: true });

  }
};
