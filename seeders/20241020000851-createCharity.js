'use strict';
const { User, Charity } = require('../models');

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
    const users = await User.findAll({
      attributes: ['id'],
      where: { role: "charity" }
    })
    const charities = users.map(user => ({
      representative: "Anh Hoàng 2k",
      establishedDate: new Date('2020-10-14 07:00:00'),
      merchantAppID: '2554',
      merchantKey1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
      merchantKey2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
      userID: user.id,
    }));
    await Charity.bulkCreate(charities)
  },

  async down(queryInterface, Sequelize) {
    await Charity.destroy({ where: {}, truncate: true });

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
