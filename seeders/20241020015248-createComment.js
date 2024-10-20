'use strict';
const { User, Campaign, Comment } = require('../models');
const {Op} = require("sequelize")

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

    const campaigns = await Campaign.findAll({
      attributes: ['id'],
      where: {
        status: {
          [Op.not]: "Planning"
        }
      }
    })
    const users = await User.findAll({
      attributes: ['id', 'name']
    })

    const comments = []
    
    campaigns.forEach(campaign => {
      users.forEach(user => {
        comments.push({
          content: "dummy messsage comment",
          campaignID: campaign.id,
          userID: user.id
        })
      })
    })

    await Comment.bulkCreate(comments)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await Comment.destroy({ where: {}, truncate: true });

  }
};
