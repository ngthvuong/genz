'use strict';

const { Charity, User, Campaign } = require('../models');

const charity = require('../models/charity');

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
    const charities = await Charity.findAll({
      attributes: ['id'],
      include: [
        {
          attributes: [],
          model: User,
          where: { status: "active" }
        }
      ],
    })
    const campaigns = [];

    charities.forEach(charity => (
      campaigns.push(
        {
          name: "Chiến Dịch Cưu Trợ Miền Trung 1",
          startDate: new Date('2020-07-14 07:00:00'),
          endDate: new Date('2020-09-14 07:00:00'),
          goal: "Mục tiêu cứu trợ 1",
          budget: 500000000,
          location: "Thừa Thiên Huế",
          status: "Finished",
          charityID: charity.id,
        },
        {
          name: "Chiến Dịch Cưu Trợ Miền Trung 2",
          startDate: new Date('2020-08-14 07:00:00'),
          endDate: new Date('2020-10-14 07:00:00'),
          goal: "Mục tiêu cứu trợ 2",
          budget: 500000000,
          location: "Quảng Trị",
          status: "Closed",
          charityID: charity.id,
        },
        {
          name: "Chiến Dịch Cưu Trợ Miền Trung 3",
          startDate: new Date('2020-09-14 07:00:00'),
          endDate: new Date('2020-11-14 07:00:00'),
          goal: "Mục tiêu cứu trợ 3",
          budget: 500000000,
          location: "Đà Nẵng",
          status: "Running",
          charityID: charity.id,
        },
        {
          name: "Chiến Dịch Cưu Trợ Miền Trung 4",
          startDate: new Date('2020-11-14 07:00:00'),
          endDate: new Date('2020-12-14 07:00:00'),
          goal: "Mục tiêu cứu trợ 4",
          budget: 500000000,
          location: "Quảng Bình",
          status: "Planning",
          charityID: charity.id,
        },
      )
    ));

    await Campaign.bulkCreate(campaigns)
  },

  async down(queryInterface, Sequelize) {
    await Campaign.destroy({ where: {}, truncate: true });

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
