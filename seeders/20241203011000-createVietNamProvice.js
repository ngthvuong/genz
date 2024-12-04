'use strict';
const { Province } = require('../models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const VietnamProvinces = [
      { "code": "HaNoi", "name": "Hà Nội", "latitude": 21.0285, "longitude": 105.8542 },
      { "code": "HoChiMinh", "name": "Hồ Chí Minh", "latitude": 10.8231, "longitude": 106.6297 },
      { "code": "DaNang", "name": "Đà Nẵng", "latitude": 16.0544, "longitude": 108.2022 },
      { "code": "HaiPhong", "name": "Hải Phòng", "latitude": 20.8449, "longitude": 106.6881 },
      { "code": "CanTho", "name": "Cần Thơ", "latitude": 10.0452, "longitude": 105.7469 },
      { "code": "BaRiaVungTau", "name": "Bà Rịa - Vũng Tàu", "latitude": 10.5417, "longitude": 107.2429 },
      { "code": "BacGiang", "name": "Bắc Giang", "latitude": 21.2731, "longitude": 106.1945 },
      { "code": "BacKan", "name": "Bắc Kạn", "latitude": 22.1477, "longitude": 105.8348 },
      { "code": "BacLieu", "name": "Bạc Liêu", "latitude": 9.2861, "longitude": 105.7221 },
      { "code": "BacNinh", "name": "Bắc Ninh", "latitude": 21.1861, "longitude": 106.0763 },
      { "code": "BenTre", "name": "Bến Tre", "latitude": 10.2415, "longitude": 106.3758 },
      { "code": "BinhDinh", "name": "Bình Định", "latitude": 13.7768, "longitude": 109.2236 },
      { "code": "BinhDuong", "name": "Bình Dương", "latitude": 11.1735, "longitude": 106.6649 },
      { "code": "BinhPhuoc", "name": "Bình Phước", "latitude": 11.6964, "longitude": 106.6538 },
      { "code": "BinhThuan", "name": "Bình Thuận", "latitude": 11.0904, "longitude": 108.0721 },
      { "code": "CaMau", "name": "Cà Mau", "latitude": 9.1798, "longitude": 105.1509 },
      { "code": "CaoBang", "name": "Cao Bằng", "latitude": 22.6639, "longitude": 106.2590 },
      { "code": "DakLak", "name": "Đắk Lắk", "latitude": 12.7100, "longitude": 108.2378 },
      { "code": "DakNong", "name": "Đắk Nông", "latitude": 12.2530, "longitude": 107.6211 },
      { "code": "DienBien", "name": "Điện Biên", "latitude": 21.3825, "longitude": 103.0167 },
      { "code": "DongNai", "name": "Đồng Nai", "latitude": 10.9453, "longitude": 106.8243 },
      { "code": "DongThap", "name": "Đồng Tháp", "latitude": 10.6036, "longitude": 105.6917 },
      { "code": "GiaLai", "name": "Gia Lai", "latitude": 13.9732, "longitude": 108.0151 },
      { "code": "HaGiang", "name": "Hà Giang", "latitude": 22.8233, "longitude": 104.9836 },
      { "code": "HaNam", "name": "Hà Nam", "latitude": 20.5831, "longitude": 105.9218 },
      { "code": "HaTinh", "name": "Hà Tĩnh", "latitude": 18.3334, "longitude": 105.9046 },
      { "code": "HaiDuong", "name": "Hải Dương", "latitude": 20.9418, "longitude": 106.3330 },
      { "code": "HauGiang", "name": "Hậu Giang", "latitude": 9.7579, "longitude": 105.5800 },
      { "code": "HoaBinh", "name": "Hòa Bình", "latitude": 20.8172, "longitude": 105.3376 },
      { "code": "HungYen", "name": "Hưng Yên", "latitude": 20.6467, "longitude": 106.0511 },
      { "code": "KhanhHoa", "name": "Khánh Hòa", "latitude": 12.2451, "longitude": 109.1943 },
      { "code": "KienGiang", "name": "Kiên Giang", "latitude": 10.0153, "longitude": 105.0918 },
      { "code": "KonTum", "name": "Kon Tum", "latitude": 14.3636, "longitude": 108.0078 },
      { "code": "LaiChau", "name": "Lai Châu", "latitude": 22.3804, "longitude": 103.4706 },
      { "code": "LamDong", "name": "Lâm Đồng", "latitude": 11.9415, "longitude": 108.4583 },
      { "code": "LangSon", "name": "Lạng Sơn", "latitude": 21.8537, "longitude": 106.7636 },
      { "code": "LaoCai", "name": "Lào Cai", "latitude": 22.3381, "longitude": 103.9732 },
      { "code": "LongAn", "name": "Long An", "latitude": 10.6956, "longitude": 106.1450 },
      { "code": "NamDinh", "name": "Nam Định", "latitude": 20.4375, "longitude": 106.1621 },
      { "code": "NgheAn", "name": "Nghệ An", "latitude": 18.8894, "longitude": 105.4703 },
      { "code": "NinhBinh", "name": "Ninh Bình", "latitude": 20.2509, "longitude": 105.9745 },
      { "code": "NinhThuan", "name": "Ninh Thuận", "latitude": 11.5673, "longitude": 108.9833 },
      { "code": "PhuTho", "name": "Phú Thọ", "latitude": 21.3362, "longitude": 105.1991 },
      { "code": "PhuYen", "name": "Phú Yên", "latitude": 13.0955, "longitude": 109.2928 },
      { "code": "QuangBinh", "name": "Quảng Bình", "latitude": 17.6100, "longitude": 106.3487 },
      { "code": "QuangNam", "name": "Quảng Nam", "latitude": 15.5730, "longitude": 108.4740 },
      { "code": "QuangNgai", "name": "Quảng Ngãi", "latitude": 15.1205, "longitude": 108.7921 },
      { "code": "QuangNinh", "name": "Quảng Ninh", "latitude": 20.9591, "longitude": 107.0983 },
      { "code": "QuangTri", "name": "Quảng Trị", "latitude": 16.7685, "longitude": 107.1414 },
      { "code": "SocTrang", "name": "Sóc Trăng", "latitude": 9.6039, "longitude": 105.9808 },
      { "code": "SonLa", "name": "Sơn La", "latitude": 21.3259, "longitude": 103.9188 },
      { "code": "TayNinh", "name": "Tây Ninh", "latitude": 11.3634, "longitude": 106.1332 },
      { "code": "ThaiBinh", "name": "Thái Bình", "latitude": 20.4464, "longitude": 106.3428 },
      { "code": "ThaiNguyen", "name": "Thái Nguyên", "latitude": 21.5928, "longitude": 105.8441 },
      { "code": "ThanhHoa", "name": "Thanh Hóa", "latitude": 19.8076, "longitude": 105.7769 },
      { "code": "ThuaThienHue", "name": "Thừa Thiên Huế", "latitude": 16.4637, "longitude": 107.5909 },
      { "code": "TienGiang", "name": "Tiền Giang", "latitude": 10.3669, "longitude": 106.2459 },
      { "code": "TraVinh", "name": "Trà Vinh", "latitude": 9.9371, "longitude": 106.3420 },
      { "code": "TuyenQuang", "name": "Tuyên Quang", "latitude": 21.8238, "longitude": 105.2140 },
      { "code": "VinhLong", "name": "Vĩnh Long", "latitude": 10.2566, "longitude": 105.9655 },
      { "code": "VinhPhuc", "name": "Vĩnh Phúc", "latitude": 21.3072, "longitude": 105.6040 },
      { "code": "YenBai", "name": "Yên Bái", "latitude": 21.7223, "longitude": 104.9113 }
    ]

    await Province.bulkCreate(VietnamProvinces)
  },

  async down(queryInterface, Sequelize) {
    await Province.destroy({ where: {}, truncate: true });
  }
};
