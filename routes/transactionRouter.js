'use strict';

const express = require('express');
const controller = require('../controllers/transactionController');
const router = express.Router();
const transferValid = require('../validations/payment/transferValid');

router.use(require('../middlewares/auth').isLogged());

const permission = require("../middlewares/permission")

router.get('/', permission.check("donate", "all"), controller.showList);
router.get('/transfer', permission.check("donate", "all"), controller.show);
router.post('/transfer', permission.check("donate", "all"), transferValid, controller.transfer);
router.get('/callback', permission.check("donate", "all"), controller.callback);

module.exports = router;
