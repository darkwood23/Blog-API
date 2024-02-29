const Comment = require("../models/comment")
const asyncHandler = require("express-async-handler")
const Post = require("../models/post")

module.exports.write_comments = asyncHandler( async (req, res, next) => {
    const postExists = await Post.findById(req.headers['POST-ID']).exec()
    const comment = new Comment({
        user: req.headers['USER'],
        comment: req.headers['COMMENT']
    })

    let newComments = postExists.comment.push(comment)

    if (postExists) {
        const post = new Post( {
            title: postExists.title,
            text: postExists.text,
            user: postExists.user,
            comment: newComments
        })

        await Post.findbyIdAndUpdate(postExists, post, {})

        res.json({
            message: "Comment added successfully",
            status: 200
        })
    } else {
        res.status(404).send("Post not found")
    }
})