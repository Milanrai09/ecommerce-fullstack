const express = require('express');
const { getCart, deleteCart,removeCart,quantityUpdate } = require('../controllers/cartController');
const { verifyToken } = require('../middleware/userMiddleware');

const router = express.Router();

// router.post('/placeOrder',createOrder);
router.get('/:id',verifyToken,getCart);
router.delete('/removeCart/:id',removeCart)
router.put('/update-quantity/:cartId',quantityUpdate )

module.exports = router;
