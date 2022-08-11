const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');
const Product = require('../models/product');
const {errorHandler} = require('../helpers/dbErrorHandlers')



exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}
exports.productById = (req, res,next,id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
        if (err) {
            return res.status(400).json({
                error:"product doesn't exist"
            })
        }
        req.product = product;
        next();
    })
}




exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error:"product form not found."
            })
        }
        let product = new Product(fields);
        
        const { name, description, price, quantity, category, shipping } = fields;

        if (!name || !description || !price || !quantity || !category || !shipping) {
            return res.status(400).json({
                error: "All fields are required"
            })
        }
        if (files.photo) {

            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error:"Image should be less than 1mb"
                })
            }

            product.photo.data = fs.readFileSync(files.photo.filepath);
            product.photo.contentType = files.photo.type;
        }
        product.save((err,result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result)
        })
    })
}






exports.remove = (req, res) => {
    let product = req.product;

    console.log(req.product)
    product.remove((err, deleteProduct) => {
        if (err || !deleteProduct) {
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json({
            deleteProduct,
            msg:"Product removed successful"
    })
    })
}






exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error:"product form not found."
            })
        }
        let product = req.product;
        product = _.extend(product, fields);
        
        if (files.photo) {

            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error:"Image should be less than 1mb"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.filepath);
            product.photo.contentType = files.photo.type;
        }


        product.save((err,result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result);
        })
    })
}





exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'desc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;

    Product.find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy,order]])
        .limit(limit)
        .exec((err, product) => {
            if (err) {
                res.status(400).json({
                error:errorHandler(err)
                })
            }
            res.json(product)
    })
}






/**
 * list related product using category fields
 *  not include the product currently on the user
 * 
 */
exports.relatedProduct = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    Product.find({ _id: { $ne: req.product }, category:req.product.category })
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, product) => {
            if (err) {
                res.status(400).json({
                error:errorHandler(err)
                })
            }
            res.json(product)
    })

}




/**
 * list category from product model 
 * that referr to category and print 
 * all category from product.
 */
exports.listCategory = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if (err) {
            res.status(400).json({
                error: errorHandler(err)
          })
        }
      res.json(categories)  
    })
}

exports.photo = (req, res) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        res.send(req.product.photo.data);
    }
}




/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
    if (isNaN(skip)) {
        skip = 0;
    }
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                    
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.listSearch = (req, res) => {
    let query = {};
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: "i" };
        if (req.query.category && req.query.category != "All") {
            query.category = req.query.category;
        }
    }

    Product.find(query, (err, product) => {
        if (err) {
            res.status(400).json({
                error: errorHandler(err)
            })
        } else {
            res.json(product)
        }
    })
        .select("-photo")    
}


exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        }
    });
 
    Product.bulkWrite(bulkOps, {}, (err, result) => {
        if (err) {
            res.status(400).json({
                error:"couldnot be updated"
            })
        }
        next();
    })
}