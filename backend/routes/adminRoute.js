
const express = require('express');
const { getUser,getAllUser,getProduct, addProduct,updateProduct, removeProduct,cancelOrder, makeAdmin, demoteAdmin, getAllOrders,updateUser, removeUser,updateOrder , AdminupdateOrder} = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/userMiddleware');
const router = express.Router();

router.get('/users',getAllUser);
router.post('/addProduct',addProduct);
router.delete('/removeProduct/:id',removeProduct);
router.put('/promote/:id',makeAdmin);
router.put('/demote',demoteAdmin);
router.get('/order',verifyToken,getAllOrders);
router.put('/update',updateUser);
router.put('/cancel/:id',cancelOrder)
router.get('/getProduct',getProduct)
router.delete('/removeUser/:id',removeUser)
router.put('/updateUser/:id',updateUser)
router.put('/updateOrder',verifyAdmin,AdminupdateOrder)
router.put('/products/updateProduct',verifyAdmin,updateProduct)


module.exports = router;



