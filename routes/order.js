const express = require('express');
const router = express.Router();

const {create, listOrder, listStatus,updateOrderStatus,orderById } = require('../controllers/order')
const { requireSignin, isAuth,isAdmin } = require('../controllers/auth')
const { userById, addOrderToUserHistory } = require('../controllers/user');
const { decreaseQuantity } = require('../controllers/product');

router.post('/order/create/:userId',requireSignin,isAuth, addOrderToUserHistory,decreaseQuantity,create)
router.get('/order/list/:userId',requireSignin,isAuth, isAdmin,listOrder)
router.get('/order/status-value/:userId', requireSignin, isAuth, isAdmin, listStatus)
router.put("/order/:orderId/status/:userId", requireSignin, isAuth, isAdmin, updateOrderStatus)

router.param('userId', userById);
router.param('orderId', orderById);

module.exports = router;