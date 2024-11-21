'use strict';
const { User } = require('../models');

const { hashPassword } = require('../services/authService')


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
    await User.bulkCreate([
      {
        name: "Admin GenZ Team",
        phone: "0909093060",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093060.jpg",
        email: "admin@genz.com",
        status: 'active',
        role: "admin",
        notifyChannel: "phone"
      },
      {
        name: "Đóng Góp 1",
        phone: "0909093061",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093061.jpg",
        email: "hoangle@genz.com",
        status: 'active',
        role: "donor",
        notifyChannel: "phone"
      },
      {
        name: "Đóng Góp 2",
        phone: "0909093261",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093061.jpg",
        email: "hoangle2@genz.com",
        status: 'active',
        role: "donor",
        notifyChannel: "phone"
      },
      {
        name: "Đóng Góp 3",
        phone: "0909093361",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093061.jpg",
        email: "hoangle3@genz.com",
        status: 'active',
        role: "donor",
        notifyChannel: "phone"
      },
      {
        name: "Đóng Góp 4",
        phone: "0909093461",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093061.jpg",
        email: "hoangle4@genz.com",
        status: 'active',
        role: "donor",
        notifyChannel: "phone"
      },
      {
        name: "Đóng Góp 5",
        phone: "0909093561",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093061.jpg",
        email: "hoangle5@genz.com",
        status: 'active',
        role: "donor",
        notifyChannel: "phone"
      },
      {
        name: "Đóng Góp 6",
        phone: "0909093661",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093061.jpg",
        email: "hoangle6@genz.com",
        status: 'active',
        role: "donor",
        notifyChannel: "phone"
      },
      {
        name: "Tổ Chức Quyên Góp 1",
        phone: "0909093062",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093062.jpg",
        email: "ninvo@genz.com",
        status: 'active',
        role: "charity",
        notifyChannel: "phone"
      },
      {
        name: "Tổ Chức Quyên Góp 2",
        phone: "0909093063",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093063.jpg",
        email: "tinnguyen@genz.com",
        status: 'pending',
        role: "charity",
        notifyChannel: "phone"
      },
      {
        name: "Nhận Hỗ Trợ 1",
        phone: "0909093064",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093064.jpg",
        email: "vuongnguyen@genz.com",
        status: 'active',
        role: "recipient",
        notifyChannel: "phone"
      },
      {
        name: "Tổ Chức Quyên Góp 3",
        phone: "0909093065",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093062.jpg",
        email: "ninvo1@genz.com",
        status: 'active',
        role: "charity",
        notifyChannel: "phone"
      },
      {
        name: "Tổ Chức Quyên Góp 4",
        phone: "0909093066",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093062.jpg",
        email: "ninvo2@genz.com",
        status: 'active',
        role: "charity",
        notifyChannel: "phone"
      },
      {
        name: "Tổ Chức Quyên Góp 5",
        phone: "0909093067",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093062.jpg",
        email: "ninvo3@genz.com",
        status: 'active',
        role: "charity",
        notifyChannel: "phone"
      },
      {
        name: "Tổ Chức Quyên Góp 6",
        phone: "0909093068",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093062.jpg",
        email: "ninvo4@genz.com",
        status: 'active',
        role: "charity",
        notifyChannel: "phone"
      },
      {
        name: "Tổ Chức Quyên Góp 7",
        phone: "0909093069",
        password: hashPassword("!234qwER"),
        avatarPath: "/media/avatars/0909093062.jpg",
        email: "ninvo5@genz.com",
        status: 'active',
        role: "charity",
        notifyChannel: "phone"
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await User.destroy({ where: {}, truncate: true });
  }
};
