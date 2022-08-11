const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { expressjwt:exJwt } = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandlers');

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((error, user) => {
        if (error) {
            return res.status(400).json({
                error:errorHandler(error)
            })
        }
        user.salt = undefined
        user.hash_password= undefined
        res.json({
            user
        })
    })
    
}





exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (error, user) => {
        if (error || !user) {
            return res.status(400).json({
                error: "user doesnot exist. please signup!!"
            })
        }

        //autenticate the password if it's a match
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Password doesn\'t match'
            })
        }
        //generate secrete json web token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        //save the token to cookie
        res.cookie('t', token, { expire: new Date() + 99999 });
        const { _id, name, email, role } = user;
        return res.json({ token, _user: { _id, name, email, role } });
    })

}



exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({
        message: "signout successful"
    })
}

exports.requireSignin = exJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: 'auth',
})




exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        res.status(403).json({
            error:"Admin resource, Access denied"
        })
    }
    next();
}

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        res.status(403).json({
            error: "unauthorized user, Acces denied"
            
        })
    }
    next();
}