'use strict';
const { User, PaymentMethod, Transaction, Campaign, Charity } = require('../models');
const { Op, where } = require("sequelize")

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
    const campaigns = await Campaign.findAll({
      attributes: ['id'],
      where: {
        status: {
          [Op.not]: "Planning"
        }
      },
      include: [
        {
          attribute: ['id', 'representative'],
          model: Charity,
          include: [
            {
              model: User,
              attribute: ['id', 'name']

            }
          ]
        }
      ]
    })
    const user = await User.findOne({
      attributes: ['id', 'name'],
      where: {
        role: "donor"
      }
    })

    const paymentMethod = await PaymentMethod.findOne({
      attributes: ['id'],
      where: {
        type: "online"
      }
    })

    const transactions = [];

    campaigns.forEach(campaign => {
      for (let i = 0; i <= 311; i++) {
        transactions.push(
          {
            amount: 1000000 * (Math.floor(Math.random() * 5) + 1),
            madeAt: new Date("2020-10-14 07:00:00"),
            message: "dummy Message",
            sender: user.name,
            receiver: campaign.Charity.User.name,
            type: "Contribution",
            paymentMethodID: paymentMethod.id,
            campaignID: campaign.id
          },
        )
      }
      for (let i = 0; i <= 23; i++) {
        transactions.push(
          {
            amount: 10000000 * (Math.floor(Math.random() * 5) + 1),
            madeAt: new Date("2020-10-14 07:00:00"),
            message: "dummy Message",
            sender: campaign.Charity.User.name,
            receiver: "Xã A",
            type: "Distribution",
            paymentMethodID: paymentMethod.id,
            campaignID: campaign.id
          },
        )
      }
    });

    await Transaction.bulkCreate(transactions)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await Transaction.destroy({ where: {}, truncate: true });
  }
};
