const User = require("../models/user")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const { genPassword } = require("../lib/passportUtils")
const passport = require("passport")

module.exports.create_user = asyncHandler ( async (req, res, next) => {
    const user = new User({
        username: req.username,
        password: genPassword(req.password)
    })

    await user.save()

    jwt.sign({user}, 'secretkey', { expiresIn: '12h' }, ( err, token ) => {
        if(!err) {
            res.json({
                message: 'User created successfully',
                errors: false,
                token,
                user,
                status: 200
            })
        } else {
            res.json({
                message: 'Error creating user',
                errors: true,
                error: err
            })
        }
    })
})

module.exports.log_in_post = passport.authenticate('local')