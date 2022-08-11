const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandlers')


exports.create = (req, res) => {
    const category = new Category(req.body);
    console.log(req.body);
    category.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error:errorHandler(error)
            })
        }
        res.json(
            {
                data
            })
    })
}

exports.categoryById = (req, res, next,id) => {
    Category.findById(id).exec((error, category) => {
        if (error) {
            res.status(400).json({
                error:"category not found"
            })
        }
        req.category = category;
        next();
    })
}

exports.read = (req, res) => {
    return res.json(req.category);
}

exports.remove = (req, res) => {
    let category = req.category;
    category.remove((err, deleteCategory) => {
        if (err || !deleteCategory) {
            res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            deleteCategory,
            msg:"category removed successfull"
        })
    })
}

exports.update = (req, res) => {
    let category = req.category;
    category.name = req.body.name;
    category.save((err, upadteCategory) => {
        if (err) {
            res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json(upadteCategory)
    })
}

exports.lists = (req, res) => {
    Category.find().exec((err, category) => {
        if (err) {
            res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json(category);
    })
}