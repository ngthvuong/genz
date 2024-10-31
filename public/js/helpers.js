const incrementedIndex = function (index) {
    return index + 1;
}
const dateFormat = function (date) {
    return date ? moment(date).format('DD/MM/YYYY') : 'N/A';;
}

const dateTimeFormat = function (date) {
    return date ? moment(date).format('DD/MM/YYYY H:mm:ss') : 'N/A';
}

const formatAmount = function (amount) {
    return Number(amount).toLocaleString()
}

const nToBr = function (string) {
    return string.replace(/\n/g, "<br>");
}
const campaignStatusText = function (status) {
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
}

const convertUserRole = function (role) {
    let VNRole = "Quản Trị Viên"
    if (role == "charity") {
        VNRole = "Tổ Chức Quyên Góp"
    } else if (role == "donor") {
        VNRole = "Người Đóng Góp"
    } else if (role == "recipient") {
        VNRole = "Người Nhận Quyên Góp"
    }
    return VNRole;
}

const createStarList = function (stars) {
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
}