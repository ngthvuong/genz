'use strict';
const { User, Campaign, CampaignImage } = require('../models');
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
      attributes: ['id']
    })
    const campaignImages = [];

    campaigns.forEach(campaign => {
        campaignImages.push(
          {
            imagePath: "/media/campaigns/"+campaign.id+"_1.jpg",
            campaignID: campaign.id
          },
        )
    });
    await CampaignImage.bulkCreate(campaignImages)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await CampaignImage.destroy({ where: {}, truncate: true });
  }
};
