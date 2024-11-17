// controllers/transactionController.js
'use strict';
const { or } = require('sequelize');
const models = require('../models'); 
const payment = require("../services/payment")
const errors = require("../services/responseErrors")
const controller = {};

controller.showList = async (req, res) => {
    const donorID = req.session.user ? req.session.user.id : 0;
    const contributions = await models.Transaction.findAll({ 
        where: { 
            donorID,
            status: "Success"
         }, 
        include: [{ model: models.Campaign }],
        order: [["madeAt", "DESC"]]
    });
    res.render("transaction/list",{contributions})

}
controller.show = async (req, res) => {
    const { campaignID } = req.query;
    try {
        const campaign = await models.Campaign.findByPk(campaignID, {
            include: [
                { 
                    model: models.Charity,
                    include: [models.User], 
                    attributes: ['representative'] 
                }
            ]
        });
        if (!campaign) return res.status(404).send("Chiến dịch không tồn tại");
        if (campaign.status === 'Closed' || campaign.status === 'Finished') {
            return res.status(403).send("Chiến dịch này không còn mở để nhận quyên góp");
        }
        const paymentMethods = await models.PaymentMethod.findAll({ where: { type: 'online' } });
        res.render("transaction/transfer", { campaign, paymentMethods });
    } catch (error) {
        console.error("Error in transactionController.show:", error);
        res.status(500).send("Internal server error");
    }
};

controller.transfer = async (req, res) => {
    try {
        const { campaignID, paymentMethodID, amount, message } = req.body;

        const campaign = await models.Campaign.findByPk(campaignID);
        if (!campaign) {
            throw new Error("Chiến dịch không tồn tại");
        }

        const receiverUser = await models.User.findOne({
            include: [
                {
                    model: models.Charity,
                    where: { id: campaign.charityID }
                }
            ]
        });
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const apptransid = '210930123456_' + Date.now() + "_" + randomNum;
        const madeAt = new Date();
        const sender = res.locals.user.name;
        const receiver = receiverUser.name;
        const type = 'Contribution';
        const status = 'Pending';
        const paymentMethod = await models.PaymentMethod.findByPk(paymentMethodID);
        if (!paymentMethod) {
            throw new Error("Phương thức thanh toán không tồn tại");
        }
        const transaction = await payment.transfer(apptransid,receiverUser.Charity , paymentMethod.code, {
            appUser: res.locals.user.phone,
            amount,
            item: `[{"itemid":"${campaign.id}","itemname":"${campaign.name}"}]`,
            description: message,
        });
        if (transaction.error) {
            throw new Error(transaction.error);
        }
        await models.Transaction.create({
            apptransid,
            campaignID,
            paymentMethodID,
            amount,
            message,
            sender,
            receiver,
            type,
            status,
            donorID: res.locals.user.id,
            madeAt
        });

        return res.json({ redirectUrl: transaction.order_url });
    } catch (error) {
        console.log(error);
        errors.add({ msg: error.message });
        return res.json(errors.get());
    }
};
controller.callback = async (req, res) => {
    try {
       
        const { status, apptransid, amount, campaign } = req.query;
        const transaction = await models.Transaction.findOne({ 
            where: { apptransid },
            include: [
                { 
                    model: models.Campaign,
                    include: [
                        { 
                            model: models.Charity,
                            include: [
                                {
                                    model: models.User,
                                }
                            ]
                        }
                    ]
                }
                
            ]
        });
        if (!transaction) {
            throw new Error("Không tìm thấy giao dịch");
        }

        if (!payment.callback(transaction.Campaign.Charity,req.query)) {
            throw new Error("Dữ liệu không hợp lệ");
        }

        if (status == 1) {
            await models.Transaction.update(
                { status: "Success", amount },
                { where: { apptransid } }
            );
            return res.render('transaction/success', {
                transaction
            });
        } else {
            await models.Transaction.update(
                { status: "Failed" },
                { where: { apptransid } }
            );
            return res.render('transaction/failed', {
                errorMessage: 'Thanh toán không thành công. Vui lòng thử lại sau.'
            });
        }
    } catch (error) {
        console.log(error);
        return res.render('transaction/failed', {
            errorMessage: error.message
        });
    }
};


module.exports = controller;
