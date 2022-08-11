exports.UserSigninValidator = (req, res,next) => {
    req.check('name', "name cannot be empty").notEmpty();
    req.check('email', 'email must be between 3 and 32')
        .matches(/.+\@.+\.+/)
        .withMessage('email must containe @')
        .isLength({
            min: 4,
            max: 32
        })
    req.check('password', 'password is required')
        .matches(/\d/)
        .withMessage('Password must contain number')
    .isLength({
          min:6
    })
        .withMessage('password must contain at least 6 character')
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({
            error:firstError
        })
    }
    next();
}