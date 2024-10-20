'use strict';
const { Charity, License } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const charities = await Charity.findAll({
      attributes: ['id'],
    })
    const licenses = charities.map(charity => ({
      name: "Giấy Phép Kinh Doanh",
      imgPath: '/media/licenses/1_license_1729380163139.jpg',
      charityID: charity.id,
    }));
    await License.bulkCreate(licenses)
  },

  async down (queryInterface, Sequelize) {
    await License.destroy({ where: {}, truncate: true });

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
