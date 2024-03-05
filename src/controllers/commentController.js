const Comment = require("../models/comment")
const asyncHandler = require("express-async-handler")
const Post = require("../models/post")

module.exports.write_comments = asyncHandler( async (req, res, next) => {
    const postExists = await Post.findById(req.body.post).exec()

    const comment = new Comment({
        user: req.body.user,
        text: req.body.text,
        post: req.body.post
    })

    if (postExists) {
        await comment.save()
        res.json({
            message: 'Comment added successfully'
        })
        return
    } else {
        res.sendStatus(404)
    }
})