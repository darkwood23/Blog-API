const User = require("../models/user")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const { genPassword, checkPassword } = require("../lib/passportUtils")
require("dotenv").config()

module.exports.create_user = asyncHandler ( async (req, res, next) => {
    const user = new User({
        username: req.body.username,
        password: genPassword(req.body.password)
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
        username: req.body.username,
        password: req.body.password
    }
    
    const userExists = await User.findOne({ username: user.username }).exec()
    
    if (userExists) {
        const correctPassword = checkPassword(user.password, userExists.password)

        if (correctPassword) {
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
        } else {
            res.sendStatus(401)
        }
    } else {
        res.sendStatus(404)
    }

})