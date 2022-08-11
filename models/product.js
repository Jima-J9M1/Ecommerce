const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength:32
    },
    description: {
        type: String,
        trim: true,
        required: true,
        maxlength:2000
    },
    price: {
        type: Number,
        trim: true,
        required:true,
    },
    sold: {
        type: Number,
        default:0
    },
    quantity: {
      type:Number,  
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required:true
    },
    photo: {
        data: Buffer,
        contentType:String
    },
    shipping: {
        required:false,
        type: Boolean,

    },
}, { timeStamps: true })

module.exports = mongoose.model('Product',productSchema)