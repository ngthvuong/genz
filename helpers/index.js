const handlebars = require('handlebars');
const moment = require('moment');

handlebars.registerHelper('incrementedIndex', function (index) {
    return index + 1;
});
handlebars.registerHelper('dateFormat', function (date) {
    return date ? moment(date).format('DD/MM/YYYY') : 'N/A';;
});
handlebars.registerHelper('dateTimeFormat', function (date) {
    return date ? moment(date).format('DD/MM/YYYY H:mm:ss') : 'N/A';
});

handlebars.registerHelper('formatAmount', function (amount) {
    return Number(amount).toLocaleString();
});

handlebars.registerHelper('convertUserRole', function (role) {
    let VNRole = "Quản Trị Viên"
    if (role == "charity") {
        VNRole = "Tổ Chức Quyên Góp"
    } else if (role == "donor") {
        VNRole = "Người Đóng Góp"
    } else if (role == "recipient") {
        VNRole = "Người Nhận Quyên Góp"
    }
    return VNRole;
});

handlebars.registerHelper('createStarList', function (stars) {
    let str = '<div class="ratting">'

    let fullStars = Math.floor(stars)
    let halfStar = stars - fullStars

    let i
    for (i = 0; i < fullStars; i++) {
        str += '<i class="fas fa-star text-warning"></i>'
    }
    if (halfStar > 0) {
        str += '<i class="fas fa-star-half-alt text-warning"></i>'
        i++
    }

    for (i; i < 5; i++) {
        str += '<i class="far fa-star text-warning"></i>'
    }

    str += '</div>'

    return str
});

module.exports = {
    incrementedIndex: handlebars.helpers.incrementedIndex,
    dateFormat: handlebars.helpers.dateFormat,
    formatAmount: handlebars.helpers.formatAmount,
    dateTimeFormat: handlebars.helpers.dateTimeFormat,
    getFirstImagePath: handlebars.helpers.getFirstImagePath,
    createStarList: handlebars.helpers.createStarList,
    convertUserRole: handlebars.helpers.convertUserRole,

};