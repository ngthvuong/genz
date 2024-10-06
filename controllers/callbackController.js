'use strict'

const controller = {}

controller.zaloPay = async (req, res) => {
    console.log(req.query)
    return res.send("ban đã đóng góp thành công")
}

module.exports = controller