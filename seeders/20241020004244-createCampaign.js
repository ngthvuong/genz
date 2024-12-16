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
          name: "Chiến Dịch Cứu Trợ Miền Trung "+ charity.id +"1",
          startDate: new Date('2024-08-14 00:00:00'),
          endDate: new Date('2025-01-14 00:00:00'),
          goal: "Mục tiêu cứu trợ 1",
          description: "Sáng 11-9, phóng viên Tuổi Trẻ đã có mặt tại hiện trường vụ lũ quét kinh hoàng ở thôn Làng Nủ, xã Phúc Khánh, huyện Bảo Yên, tỉnh Lào Cai. Tang thương bao trùm khi thảm họa này đã xóa sổ một thôn với hơn 37 hộ dân.\nThông tin chính thức đến 11h ngày 11-9 về thiệt hại do lũ quét tại Làng Nủ đã vùi lấp 37 hộ dân với 158 người. Số thi thể được tìm thấy trong đống đổ nát ngày một tăng, đã có 30 người chết.\nTheo chính quyền huyện Bảo Yên, hiện vẫn còn 70 người mất tích trong cơn lũ quét, trong đó có 18 trẻ dưới 6 tuổi, 14 trẻ dưới 14 tuổi. Trong cơn lũ quét kinh hoàng có 46 người may mắn chạy thoát.\nSáng 11-9, lực lượng quân đội, công an vẫn đang gấp rút đào bới đống đổ nát để tìm kiếm những người dân của thôn Làng Nủ bị vùi lấp trong cơn lũ quét kinh hoàng.\nCảnh tượng hãi hùng đập vào mắt lực lượng cứu hộ khi đến trưa nay đã có 25 thi thể được tìm thấy. Vẫn còn 70 người dân của thôn đang mất tích, trong đó có nhiều trẻ nhỏ dưới 6 tuổi.",
          budget: 5000000000,
          location: "Thừa Thiên Huế",
          status: "Finished",
          charityID: charity.id,
        },
        {
          name: "Chiến Dịch Cứu Trợ Miền Trung "+ charity.id +"2",
          startDate: new Date('2024-09-14 00:00:00'),
          endDate: new Date('2025-11-14 00:00:00'),
          goal: "Mục tiêu cứu trợ 2",
          description: "Sáng 11-9, phóng viên Tuổi Trẻ đã có mặt tyại hiện trường vụ lũ quét kinh hoàng ở thôn Làng Nủ, xã Phúc Khánh, huyện Bảo Yên, tỉnh Lào Cai. Tang thương bao trùm khi thảm họa này đã xóa sổ một thôn với hơn 37 hộ dân.\nThông tin chính thức đến 11h ngày 11-9 về thiệt hại do lũ quét tại Làng Nủ đã vùi lấp 37 hộ dân với 158 người. Số thi thể được tìm thấy trong đống đổ nát ngày một tăng, đã có 30 người chết.\nTheo chính quyền huyện Bảo Yên, hiện vẫn còn 70 người mất tích trong cơn lũ quét, trong đó có 18 trẻ dưới 6 tuổi, 14 trẻ dưới 14 tuổi. Trong cơn lũ quét kinh hoàng có 46 người may mắn chạy thoát.\nSáng 11-9, lực lượng quân đội, công an vẫn đang gấp rút đào bới đống đổ nát để tìm kiếm những người dân của thôn Làng Nủ bị vùi lấp trong cơn lũ quét kinh hoàng.\nCảnh tượng hãi hùng đập vào mắt lực lượng cứu hộ khi đến trưa nay đã có 25 thi thể được tìm thấy. Vẫn còn 70 người dân của thôn đang mất tích, trong đó có nhiều trẻ nhỏ dưới 6 tuổi.",
          budget: 5000000000,
          location: "Quảng Trị",
          status: "Closed",
          charityID: charity.id,
        },
        {
          name: "Chiến Dịch Cứu Trợ Miền Trung "+ charity.id +"3",
          startDate: new Date('2025-01-14 00:00:00'),
          endDate: new Date('2025-12-14 00:00:00'),
          description: "Sáng 11-9, phóng viên Tuổi Trẻ đã có mặt tại hiện trường vụ lũ quét kinh hoàng ở thôn Làng Nủ, xã Phúc Khánh, huyện Bảo Yên, tỉnh Lào Cai. Tang thương bao trùm khi thảm họa này đã xóa sổ một thôn với hơn 37 hộ dân.\nThông tin chính thức đến 11h ngày 11-9 về thiệt hại do lũ quét tại Làng Nủ đã vùi lấp 37 hộ dân với 158 người. Số thi thể được tìm thấy trong đống đổ nát ngày một tăng, đã có 30 người chết.\nTheo chính quyền huyện Bảo Yên, hiện vẫn còn 70 người mất tích trong cơn lũ quét, trong đó có 18 trẻ dưới 6 tuổi, 14 trẻ dưới 14 tuổi. Trong cơn lũ quét kinh hoàng có 46 người may mắn chạy thoát.\nSáng 11-9, lực lượng quân đội, công an vẫn đang gấp rút đào bới đống đổ nát để tìm kiếm những người dân của thôn Làng Nủ bị vùi lấp trong cơn lũ quét kinh hoàng.\nCảnh tượng hãi hùng đập vào mắt lực lượng cứu hộ khi đến trưa nay đã có 25 thi thể được tìm thấy. Vẫn còn 70 người dân của thôn đang mất tích, trong đó có nhiều trẻ nhỏ dưới 6 tuổi.",
          goal: "Mục tiêu cứu trợ 3",
          budget: 5000000000,
          location: "Đà Nẵng",
          status: "Running",
          charityID: charity.id,
        },
        {
          name: "Chiến Dịch Cứu Trợ Miền Trung "+ charity.id +"4",
          startDate: new Date('2025-12-14 00:00:00'),
          endDate: new Date('2025-01-14 00:00:00'),
          goal: "Mục tiêu cứu trợ 4",
          description: "Sáng 11-9, phóng viên Tuổi Trẻ đã có mặt tại hiện trường vụ lũ quét kinh hoàng ở thôn Làng Nủ, xã Phúc Khánh, huyện Bảo Yên, tỉnh Lào Cai. Tang thương bao trùm khi thảm họa này đã xóa sổ một thôn với hơn 37 hộ dân.\nThông tin chính thức đến 11h ngày 11-9 về thiệt hại do lũ quét tại Làng Nủ đã vùi lấp 37 hộ dân với 158 người. Số thi thể được tìm thấy trong đống đổ nát ngày một tăng, đã có 30 người chết.\nTheo chính quyền huyện Bảo Yên, hiện vẫn còn 70 người mất tích trong cơn lũ quét, trong đó có 18 trẻ dưới 6 tuổi, 14 trẻ dưới 14 tuổi. Trong cơn lũ quét kinh hoàng có 46 người may mắn chạy thoát.\nSáng 11-9, lực lượng quân đội, công an vẫn đang gấp rút đào bới đống đổ nát để tìm kiếm những người dân của thôn Làng Nủ bị vùi lấp trong cơn lũ quét kinh hoàng.\nCảnh tượng hãi hùng đập vào mắt lực lượng cứu hộ khi đến trưa nay đã có 25 thi thể được tìm thấy. Vẫn còn 70 người dân của thôn đang mất tích, trong đó có nhiều trẻ nhỏ dưới 6 tuổi.",
          budget: 5000000000,
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
