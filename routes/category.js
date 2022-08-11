// const { Router } = require('express')
const express = require('express');
const router = express.Router();
const { userById } = require('../controllers/user');
const {requireSignin,isAdmin,isAuth} = require('../controllers/auth')
const { create, categoryById, read, remove, update, lists } = require('../controllers/category');

// router 
router.post('/category/create/:userId',requireSignin, isAdmin, isAuth, create);
router.get('/category/:categoryId', read);
router.delete('/category/:categoryId/:userId', requireSignin,isAdmin,isAuth,remove)
router.put('/category/:categoryId/:userId', requireSignin,isAdmin,isAuth,update);
router.get('/categories', lists)

// router middleware
router.param('userId', userById);
router.param('categoryId', categoryById);


module.exports = router;