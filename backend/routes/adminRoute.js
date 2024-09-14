
const express = require('express');
const { getUser,getAllUser,getProduct, addProduct,updateProduct, removeProduct,cancelOrder, makeAdmin, demoteAdmin, getAllOrders,updateUser, removeUser,updateOrder , AdminupdateOrder} = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/userMiddleware');
const router = express.Router();

router.get('/users',getAllUser);
router.delete('/removeProduct/:id',removeProduct);
router.put('/promote/:id',makeAdmin);
router.get('/order',verifyToken,getAllOrders);
router.put('/cancel/:id',cancelOrder)
router.get('/getProduct',getProduct)
router.put('/updateOrder',verifyAdmin,AdminupdateOrder)
router.put('/products/updateProduct',verifyAdmin,updateProduct)


module.exports = router;



