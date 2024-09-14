const express = require('express');
const {  getUserOrders, savedOrder, updateOrder } = require('../controllers/orderController');

const router = express.Router();

// router.post('/placeOrder',createOrder);
router.get('/:id',getUserOrders);
router.post('/createorders/:userid',savedOrder);

module.exports = router;
