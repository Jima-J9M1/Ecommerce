const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

require('dotenv').config();
//router middleware

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const braintreeRouter = require('./routes/braintree')
const orderRouter = require('./routes/order')
//app
const app = express();

//create mongo db connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser:true,
    // useCreateIndex: true
});
//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
// router middleware
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', categoryRouter);
app.use('/api', productRouter);
app.use('/api', braintreeRouter);
app.use('/api', orderRouter);


const port = process.env.PORT || 8000
app.listen(port, (req, res) => {
    console.log(`the port is running on ${port}`);;
});