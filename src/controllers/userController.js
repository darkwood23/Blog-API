const User = require("../models/user")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const { genPassword } = require("../lib/passportUtils")
require("dotenv").config()

module.exports.create_user = asyncHandler ( async (req, res, next) => {
    const user = new User({
        username: "Hackerman",
        password: genPassword(process.env.USER_PASSWORD)
    })

    const userExists = await User.findOne({ username: user.username })
    if(userExists) {
        res.sendStatus(409)
        return
    } else {
        await user.save()
        res.json({
            message: "User successfully created",
            user
        })
    }
})

// module.exports.log_in_post = passport.authenticate('local')
module.exports.log_in_post = asyncHandler ( async (req, res, next) => {
    const user = {
        username: req.headers['Username'],
        password: req.headers['Password']
    }
    jwt.sign({user}, 'secretkey', { expiresIn: '12h' }, ( err, token ) => {
        if(!err) {
            res.json({
                message: 'User logged in successfully',
                token,
                user,
                status: 200
            })
        } else {
            res.json({
                message: 'Error logging user',
                error: err
            })
            return
        }
    })
})