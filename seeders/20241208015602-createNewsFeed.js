'use strict';
const { NewsFeed, NewsFeedComment, NewsFeedFeeling, User, Campaign, Charity } = require('../models')

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
    const users = await User.findAll()
    const charities = await Charity.findAll({
      include: [
        {
          model: User
        },
        {
          model: Campaign
        }
      ]
    })
    for (let charity of charities) {
      for (let campaign of charity.Campaigns) {
        const newsFeed = await NewsFeed.create({
          title: `Bảng Tin Của Chiến Dịch ${campaign.name} (${campaign.id})`,
          content: `Bảng Tin Của Chiến Dịch ${campaign.name}`,
          imagePath: "/media/newsfeed/newfeed_test.jpg",
          publishedAt: Date(),
          authorID: charity.User.id,
          campaignID: campaign.id
        })
        for (let user of users) {
          const willActTouch = Math.random() < 0.4 ? 0 : 1
          if (willActTouch) {
            await NewsFeedFeeling.create({
              type: "like",
              newsFeedID: newsFeed.id,
              userID: user.id
            })
          }
          const willActComment = Math.random() < 0.3 ? 0 : 1
          if (willActComment) {
            await NewsFeedComment.create({
              content: "Dummy news feed comment",
              newsFeedID: newsFeed.id,
              userID: user.id
            })
          }
        };
      }
    }

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
