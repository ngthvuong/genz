'use strict';

const express = require('express');
const controller = require('../controllers/transactionController');
const router = express.Router();
const transferValid = require('../validations/payment/transferValid');

router.use(require('../middlewares/auth').isLogged());
router.get('/', controller.showList);  
router.get('/transfer', controller.show);  
router.post('/transfer', transferValid, controller.transfer);
router.get('/callback', controller.callback);


module.exports = router;
