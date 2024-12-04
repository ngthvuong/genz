'use strict';
const { Province, HeatMap, HeatMapProvince } = require('../models');
const heatmap = require('../models/heatmap');

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

    await HeatMap.bulkCreate([
      {
        name: "Thiệt Hại Do Bão Số 1 Gây Ra",
        status: "enable",
        unit: "VND"
      },
      {
        name: "Thiệt Hại Do Bão Số 2 Gây Ra",
        status: "disable",
        unit: "VND"
      }
    ])

    const heatMaps = await HeatMap.findAll()
    const dataset = []
    heatMaps.forEach(heatmap => {
      dataset.push(
        {
          heatMapID: heatmap.id,
          provinceCode: 'ThuaThienHue',
          value: Math.floor(10000000000 * (Math.random() * 10 + 1))
        },
        {
          heatMapID: heatmap.id,
          provinceCode: 'QuangBinh',
          value: Math.floor(10000000000 * (Math.random() * 10 + 1))
        },
        {
          heatMapID: heatmap.id,
          provinceCode: 'QuangTri',
          value: Math.floor(10000000000 * (Math.random() * 10 + 1))
        },
        {
          heatMapID: heatmap.id,
          provinceCode: 'QuangNam',
          value: Math.floor(10000000000 * (Math.random() * 10 + 1))
        },
        {
          heatMapID: heatmap.id,
          provinceCode: 'QuangNgai',
          value: Math.floor(10000000000 * (Math.random() * 100 + 1))
        }
      )
    })
    await HeatMapProvince.bulkCreate(dataset)

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await HeatMapProvince.destroy({ where: {}, truncate: true });
    await HeatMap.destroy({ where: {}, truncate: true });

  }
};
