const express = require('express');
const router = express.Router();
const{ requireSignin,isAdmin,isAuth} = require('../controllers/auth')
const { create, productById,read,remove,update,list,relatedProduct,listCategory,photo,listBySearch,listSearch } = require('../controllers/product');
const { userById } = require('../controllers/user');

// router
router.post('/product/create/:userId',create);
router.get('/product/:productId', read)// read product based on the product id
router.delete('/product/:productId/:userId',requireSignin,isAdmin,isAuth,remove)//remove product based on product id and user id
router.put('/product/:productId/:userId',requireSignin,isAdmin,isAuth,update)//update product 
router.get('/products', list)// list all product based on different parameter
router.get('/products/search', listSearch)// list all product based on different parameter
router.get('/products/related/:productId', relatedProduct)// list product based on related category
router.get('/products/categories', listCategory)
router.get('/product/photo/:productId', photo)
router.post("/products/by/search", listBySearch);


//router middleware
router.param('userId', userById);
router.param('productId', productById);

module.exports = router;