'use strict';
const { User, Campaign, Review } = require('../models');
const { Op } = require("sequelize")

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
      }
    })
    const users = await User.findAll({
      attributes: ['id', 'name'],
      where: {
        role: {
          [Op.in]: ['donor', 'recipient']
        }
      }
    })

    const reviews = []
    
    campaigns.forEach(campaign => {
      users.forEach(user => {
        reviews.push({
          rating: (Math.floor(Math.random() * 5) + 1).toString(),
          message: "dummy messsage",
          campaignID: campaign.id,
          userID: user.id
        })
      })
    })

    await Review.bulkCreate(reviews)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await Review.destroy({ where: {}, truncate: true });

  }
};
