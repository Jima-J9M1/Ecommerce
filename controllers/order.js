const { errorHandler } = require('../helpers/dbErrorHandlers')
const { Order, CartItem } = require('../models/order');



exports.orderById = (req, res, next, id) => {
    Order.findById(id)
        .populate('products.product', 'name price')
        .exec((err, order) => {
            if (err || !order) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            req.order = order;
            next();
        });
};


exports.create = (req, res) => {
    req.body.order.user = req.profile;
    
    const order = new Order(req.body.order);
    order.save((err, result) => {
        if (result.error) {
           return  res.status(400).json({
                error:errorHandler(err)
            })
        }else {
            res.json(result)
        }
    })
}


exports.listOrder = (req, res) => {
    Order.find()
        .populate('user', '_id name address')
        .sort('created')
        .exec((err,order) => {
            if (err) {
                return res.status(400).json({
                error:"Order not found"
                })
        }else {
            res.json(order)
    }
    })
    
}


exports.listStatus = (req, res) => {
    res.json(Order.schema.path('status').enumValues)
}

exports.updateOrderStatus = (req, res) => {
    Order.update({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(order);
    });
};