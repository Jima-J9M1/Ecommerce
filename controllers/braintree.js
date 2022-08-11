const User = require('../models/user')
const braintree = require('braintree');
const { PaymentMethodNonce } = require('braintree');
require("dotenv").config();


const getway = new braintree.BraintreeGateway({
    environment : braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

exports.generateToken = (req,res) => {
    getway.clientToken.generate({},(err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            res.send(data)
        }
    })
}

exports.processPayment = (req, res) => {
    let getNonceFromClient = req.body.paymentMethodNonce;
    let paymentAmount = req.body.amount;
    
    let newTransaction = getway.transaction.sale({
        amount: paymentAmount,
        paymentMethodNonce: getNonceFromClient,
        options: {
            submitForSettlement : true
        }
    }, (err,result) => {
        if (err) {
            req.status(500).json({
                err
            })
        } else {
            res.json(result)
        }
    })
}