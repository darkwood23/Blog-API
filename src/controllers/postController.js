const Post = require("../models/post")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

module.exports.get_allPosts = asyncHandler( async (req, res, next ) => {
    const [
        numPosts,
        allPosts
    ] = await Promise.all([
        Post.countDocuments({}).exec(),
        Post.find().exec()
    ])

    res.json({ title: 'Post Index', number_posts: numPosts, posts_array: allPosts })
})

module.exports.write_Posts = asyncHandler( async (req, res, next) => {
    let post
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if (err) {
            res.sendStatus(403)
            return
        } else {
            post = new Post({
                title: req.body.postTitle,
                text: req.body.postText,
                user: req.user,
                comments: []
            })
            res.json({
                message: 'Post Created ...',
                authData,
                post,
                status: 200
            })
        }
    })
    await post.save()
})

module.exports.delete_posts = asyncHandler( async (req, res, next) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
            return
        }
    })
    await Post.findByIdAndDelete(req.params.id).exec()
    res.json({
        message: 'Message successfully deleted',
        status: 200
    })
})

module.exports.edit_posts = asyncHandler( async (req, res, next) => {
    const exists = await Post.findById(req.params.id).exec()
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
            return
        }
    })
    if(exists) {
        let post = new Post({
            title: req.body.postTitle,
            text: req.body.postText,
            user: req.user,
            comments: req.body.comments
        })

        await Post.findbyIdAndUpdate(req.params.id, post, {})

        res.json({
            message: 'Post Updated Successfuly',
            status: 200
        })
    } else {
        res.sendStatus(404)
    }
})