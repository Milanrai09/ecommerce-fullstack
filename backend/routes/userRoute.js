const express = require('express');
const { getUser, registerUser, loginUser, getAllUser, userLogout ,addProductToCart } = require('../controllers/userController');
const { updateCart, getCart, createCarts } = require('../controllers/cartController');
const { cancelOrder } = require('../controllers/adminController');
const { verifyToken } = require('../middleware/userMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/cart',verifyToken,getCart);
router.get('/',getAllUser)
router.post('/addtocart',verifyToken,createCarts)
module.exports = router;


