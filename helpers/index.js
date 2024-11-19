const handlebars = require('handlebars')
const moment = require('moment')

handlebars.registerHelper('incrementedIndex', function (index) {
    return index + 1
})
handlebars.registerHelper('dateFormat', function (date, format = "DD/MM/YYYY") {
    const formatDate = (typeof format === 'string') ? format : "DD/MM/YYYY"
    return date ? moment(date).format(formatDate) : 'N/A'
});
handlebars.registerHelper('dateTimeFormat', function (date) {
    return date ? moment(date).format('DD/MM/YYYY H:mm:ss') : 'N/A'
})

handlebars.registerHelper('formatAmount', function (amount) {
    return Number(amount).toLocaleString(
        'vi-VN',
        { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    )
})

handlebars.registerHelper('nToBr', function (string) {
    return string.replace(/\n/g, "<br>")
})

handlebars.registerHelper('campaignStatusText', function (status) {
    let statusText = "Đã kết thúc"
    switch (status) {
        case 'Planning':
            statusText = "Lập kế hoạch"
            break
        case 'Running':
            statusText = "Đang thực hiện"
            break
        case 'Closed':
            statusText = "Đã kết thúc"
            break
        case 'Finished':
            statusText = "Đã đóng"
            break
    }
    return statusText
})

handlebars.registerHelper('convertUserStatus', function (status) {
    let statusText = "Đang hoạt động"
    if (status == "inactive") {
        statusText = 'Không hoạt động'
    }
    else if (status == "pending") {
        statusText = "Đang đợi phê duyệt"
    }
    else if (status == "reject") {
        statusText = "Từ chối phê duyệt"
    }
    return statusText
})

handlebars.registerHelper('roundToOneDecimal', function (number) {
    if (typeof number === 'number' && !isNaN(number)) {
        return (Math.round(number * 10) / 10).toFixed(1)
    }
    return number
})

handlebars.registerHelper('convertUserRole', function (role) {
    let VNRole = "Quản Trị Viên"
    if (role == "charity") {
        VNRole = "Tổ Chức Quyên Góp"
    } else if (role == "donor") {
        VNRole = "Người Đóng Góp"
    } else if (role == "recipient") {
        VNRole = "Người Nhận Quyên Góp"
    }
    return VNRole
})
handlebars.registerHelper('convertCampaignStatus', function (role) {
    let VNRole = "Đã Kết Thúc"
    if (role == "Planning") {
        VNRole = "Kế Hoạch"
    } else if (role == "Running") {
        VNRole = "Đang Thực Hiện"
    } else if (role == "Closed") {
        VNRole = "Đã Đóng"
    }
    return VNRole
})

handlebars.registerHelper('createStarList', function (stars) {
    let str = '<div class="rating d-flex justify-content-center">'

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
})
handlebars.registerHelper('eq', (a, b) => a === b);
handlebars.registerHelper('neq', (a, b) => a !== b);

handlebars.registerHelper('parseInt', (number) => parseInt(number));



module.exports = {
    incrementedIndex: handlebars.helpers.incrementedIndex,
    dateFormat: handlebars.helpers.dateFormat,
    formatAmount: handlebars.helpers.formatAmount,
    dateTimeFormat: handlebars.helpers.dateTimeFormat,
    getFirstImagePath: handlebars.helpers.getFirstImagePath,
    createStarList: handlebars.helpers.createStarList,
    convertUserStatus: handlebars.helpers.convertUserStatus,
    roundToOneDecimal: handlebars.helpers.roundToOneDecimal,
    convertUserRole: handlebars.helpers.convertUserRole,
    campaignStatusText: handlebars.helpers.campaignStatusText,
    nToBr: handlebars.helpers.nToBr,
    convertCampaignStatus: handlebars.helpers.convertCampaignStatus,
    eq: handlebars.helpers.eq,
    neq: handlebars.helpers.neq,
    parseInt: handlebars.helpers.parseInt,

}