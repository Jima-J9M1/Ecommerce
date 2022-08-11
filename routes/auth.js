const { Router } = require('express')
const express = require('express')
const router = express.Router()
const { signup,signin,signout,requireSignin,isAdim,isAuth} = require('./../controllers/auth')
const { UserSigninValidator } = require('../validator/index')

router.post('/signup', UserSigninValidator,signup)
router.post('/signin', signin)
router.get('/signout', signout)

module.exports = router